// Scholarmate desktop launcher: one portable exe, no install. The site is served straight from the zip embedded in the exe (nothing is
// unpacked), on http://localhost:47615/ (a fixed address, so saved progress stays with the same browser origin). Progress lives in a
// browser profile kept in a folder NEXT TO THE EXE (ChessSchoolData), so the folder can be copied, run from a USB stick or deleted
// (drop it in the recycle bin) with nothing left behind. If the exe's folder is read-only, the data folder falls back to
// %LOCALAPPDATA%\ChessSchool and the tray notice says so.
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Reflection;
using System.Threading;
using System.Windows.Forms;

static class Launcher
{
    const int Port = 47615;
    static readonly string Url = "http://localhost:" + Port + "/";
    static string DataDir;
    static ZipArchive Zip;
    static readonly object ZipLock = new object();
    static readonly Dictionary<string, string> Mime = new Dictionary<string, string> {
        {".html","text/html; charset=utf-8"},{".js","text/javascript"},{".mjs","text/javascript"},{".css","text/css"},{".json","application/json"},
        {".wasm","application/wasm"},{".svg","image/svg+xml"},{".png","image/png"},{".jpg","image/jpeg"},{".ico","image/x-icon"},
        {".woff","font/woff"},{".woff2","font/woff2"},{".txt","text/plain; charset=utf-8"},{".webmanifest","application/manifest+json"} };

    [STAThread]
    static System.Drawing.Icon LoadIcon()
    {
        try { using (var s = Assembly.GetExecutingAssembly().GetManifestResourceStream("icon.ico")) return new System.Drawing.Icon(s); }
        catch { return System.Drawing.SystemIcons.Application; }
    }

    static void Main()
    {
        bool first;
        var mutex = new Mutex(true, "ChessSchoolLauncher47615", out first);
        bool portable;
        DataDir = PickDataDir(out portable);
        if (!first) { Open(); return; } // already running: just open another window
        try
        {
            var ms = new MemoryStream();
            using (var s = Assembly.GetExecutingAssembly().GetManifestResourceStream("site.zip")) s.CopyTo(ms);
            ms.Position = 0;
            Zip = new ZipArchive(ms, ZipArchiveMode.Read);
        }
        catch (Exception e) { MessageBox.Show("Could not read the Scholarmate files:\n" + e.Message, "Scholarmate"); return; }

        var listener = new HttpListener();
        listener.Prefixes.Add(Url);
        try { listener.Start(); }
        catch (Exception e)
        {
            // Something already answers on our address. If it is Scholarmate (another copy still running), just open it.
            try { using (var w = new WebClient()) { w.Headers["User-Agent"] = "ChessSchoolLauncher"; if (w.DownloadString(Url).Contains("id=\"root\"")) { Open(); return; } } } catch { }
            MessageBox.Show("Port " + Port + " is in use, so Scholarmate cannot start.\n" + e.Message, "Scholarmate"); return;
        }
        new Thread(() => Serve(listener)) { IsBackground = true }.Start();
        Open();

        var menu = new ContextMenu();
        menu.MenuItems.Add("Open Scholarmate", (s, a) => Open());
        menu.MenuItems.Add("Quit", (s, a) => { try { listener.Close(); } catch { } Environment.Exit(0); });
        var icon = new NotifyIcon { Icon = LoadIcon(), Text = "Scholarmate (running)", ContextMenu = menu, Visible = true };
        icon.DoubleClick += (s, a) => Open();
        icon.ShowBalloonTip(4000, "Scholarmate", portable ? "Running. Your progress is saved in the ChessSchoolData folder next to this program. Right-click this icon to quit." : "Running. This folder is read-only, so progress is saved in your user profile instead. Right-click this icon to quit.", ToolTipIcon.Info);
        Application.Run();
        icon.Visible = false; listener.Stop();
    }

    /** The data folder next to the exe when it can be written; otherwise the user profile. */
    static string PickDataDir(out bool portable)
    {
        string beside = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), "ChessSchoolData");
        try { Directory.CreateDirectory(beside); string t = Path.Combine(beside, ".w"); File.WriteAllText(t, "x"); File.Delete(t); portable = true; return beside; }
        catch { portable = false; string d = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "ChessSchool"); Directory.CreateDirectory(d); return d; }
    }

    static void Serve(HttpListener l)
    {
        while (l.IsListening)
        {
            HttpListenerContext c;
            try { c = l.GetContext(); } catch { if (!l.IsListening) return; continue; } // a dropped connection must not stop the server
            ThreadPool.QueueUserWorkItem(_ =>
            {
                try
                {
                    string rel = Uri.UnescapeDataString(c.Request.Url.AbsolutePath).TrimStart('/');
                    if (rel == "") rel = "index.html";
                    byte[] data = null;
                    lock (ZipLock)
                    {
                        var e = Zip.GetEntry(rel) ?? Zip.GetEntry(rel.Replace('/', '\\')); // zip entry names may use either slash
                        if (e != null) using (var s = e.Open()) { var b = new MemoryStream(); s.CopyTo(b); data = b.ToArray(); }
                    }
                    if (data == null) { c.Response.StatusCode = 404; c.Response.Close(); return; }
                    string mt; if (!Mime.TryGetValue(Path.GetExtension(rel).ToLowerInvariant(), out mt)) mt = "application/octet-stream";
                    c.Response.ContentType = mt; c.Response.ContentLength64 = data.Length;
                    c.Response.OutputStream.Write(data, 0, data.Length); c.Response.Close();
                }
                catch { try { c.Response.Abort(); } catch { } }
            });
        }
    }

    static void Open()
    {
        string[] browsers = {
            Environment.ExpandEnvironmentVariables(@"%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"),
            Environment.ExpandEnvironmentVariables(@"%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"),
            Environment.ExpandEnvironmentVariables(@"%ProgramFiles%\Google\Chrome\Application\chrome.exe"),
            Environment.ExpandEnvironmentVariables(@"%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"),
            Environment.ExpandEnvironmentVariables(@"%LocalAppData%\Google\Chrome\Application\chrome.exe") };
        string profile = Path.Combine(DataDir, "profile");
        foreach (var b in browsers)
            if (File.Exists(b)) { try { Process.Start(b, "--user-data-dir=\"" + profile + "\" --no-first-run --no-default-browser-check --app=" + Url); return; } catch { } }
        Process.Start(new ProcessStartInfo(Url) { UseShellExecute = true }); // last resort: the default browser (its own profile; progress is not portable)
    }
}
