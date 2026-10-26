// Chess School desktop launcher: one exe, no install. It unpacks the embedded site to %LOCALAPPDATA%\ChessSchool, serves it on
// http://localhost:47615/ (a fixed address, so saved progress stays with the same browser origin) and opens it in an app-style window.
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
    static readonly Dictionary<string, string> Mime = new Dictionary<string, string> {
        {".html","text/html; charset=utf-8"},{".js","text/javascript"},{".mjs","text/javascript"},{".css","text/css"},{".json","application/json"},
        {".wasm","application/wasm"},{".svg","image/svg+xml"},{".png","image/png"},{".jpg","image/jpeg"},{".ico","image/x-icon"},
        {".woff","font/woff"},{".woff2","font/woff2"},{".txt","text/plain; charset=utf-8"},{".webmanifest","application/manifest+json"} };

    [STAThread]
    static void Main()
    {
        bool first;
        var mutex = new Mutex(true, "ChessSchoolLauncher47615", out first);
        if (!first) { Open(); return; } // already running: just open another window
        string root = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "ChessSchool", "site");
        try { Unpack(root); }
        catch (Exception e) { MessageBox.Show("Could not unpack Chess School:\n" + e.Message, "Chess School"); return; }

        var listener = new HttpListener();
        listener.Prefixes.Add(Url);
        try { listener.Start(); }
        catch (Exception e) { MessageBox.Show("Port " + Port + " is in use, so Chess School cannot start.\n" + e.Message, "Chess School"); return; }
        new Thread(() => Serve(listener, root)) { IsBackground = true }.Start();
        Open();

        var menu = new ContextMenu();
        menu.MenuItems.Add("Open Chess School", (s, a) => Open());
        menu.MenuItems.Add("Quit", (s, a) => { Application.Exit(); });
        var icon = new NotifyIcon { Icon = System.Drawing.SystemIcons.Application, Text = "Chess School (running)", ContextMenu = menu, Visible = true };
        icon.DoubleClick += (s, a) => Open();
        icon.ShowBalloonTip(3000, "Chess School", "Running. Right-click this icon to quit.", ToolTipIcon.Info);
        Application.Run();
        icon.Visible = false; listener.Stop();
    }

    static void Unpack(string root)
    {
        var asm = Assembly.GetExecutingAssembly();
        string stamp = File.GetLastWriteTimeUtc(asm.Location).Ticks.ToString();
        string stampFile = Path.Combine(root, ".stamp");
        if (File.Exists(stampFile) && File.ReadAllText(stampFile) == stamp) return;
        if (Directory.Exists(root)) Directory.Delete(root, true);
        Directory.CreateDirectory(root);
        using (var s = asm.GetManifestResourceStream("site.zip"))
        using (var z = new ZipArchive(s))
            foreach (var e in z.Entries)
            {
                if (e.FullName.EndsWith("/")) continue;
                string dest = Path.GetFullPath(Path.Combine(root, e.FullName));
                if (!dest.StartsWith(Path.GetFullPath(root))) continue;
                Directory.CreateDirectory(Path.GetDirectoryName(dest));
                e.ExtractToFile(dest, true);
            }
        File.WriteAllText(stampFile, stamp);
    }

    static void Serve(HttpListener l, string root)
    {
        string full = Path.GetFullPath(root);
        while (l.IsListening)
        {
            HttpListenerContext c;
            try { c = l.GetContext(); } catch { return; }
            ThreadPool.QueueUserWorkItem(_ =>
            {
                try
                {
                    string rel = Uri.UnescapeDataString(c.Request.Url.AbsolutePath).TrimStart('/');
                    if (rel == "") rel = "index.html";
                    string path = Path.GetFullPath(Path.Combine(full, rel.Replace('/', Path.DirectorySeparatorChar)));
                    if (!path.StartsWith(full) || !File.Exists(path)) { c.Response.StatusCode = 404; c.Response.Close(); return; }
                    string mt; if (!Mime.TryGetValue(Path.GetExtension(path).ToLowerInvariant(), out mt)) mt = "application/octet-stream";
                    byte[] data = File.ReadAllBytes(path);
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
        foreach (var b in browsers)
            if (File.Exists(b)) { try { Process.Start(b, "--app=" + Url); return; } catch { } }
        Process.Start(new ProcessStartInfo(Url) { UseShellExecute = true });
    }
}
