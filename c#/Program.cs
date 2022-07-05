using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Windows.Forms;
using static System.Environment;

namespace FKRealSvrOcxTcpSample
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            string sysPath = GetFolderPath(SpecialFolder.SystemX86);//获取系统盘
            if (File.Exists(sysPath))
                CopyFile(System.Environment.CurrentDirectory+ @"\RealSvrOcxTcp.ocx", sysPath+@"\RealSvrOcxTcp.ocx");
            AutoRegister();
            Application.Run(new Form1());
        }
       
        private static void CopyFile(string path, string path2)
        {
            try
            {

                FileInfo fi1 = new FileInfo(path);
                FileInfo fi2 = new FileInfo(path2);

                if (File.Exists(path2))
                {
                    fi2.Delete();
                }
                fi1.CopyTo(path2);
            }
            catch (Exception e)
            {
                throw;
            }
        }
        /// <summary>
        /// 注册动态库文件
        /// </summary>
        private static void AutoRegister()
        {
            RegisterDllOcx("RealSvrOcxTcp.ocx");
        }

        unsafe internal delegate UInt32 DllRegisterServer();
        [DllImport("kernel32.dll")]
        private extern static IntPtr LoadLibrary(String LibFileName);
        [DllImport("kernel32.dll")]
        private extern static IntPtr GetProcAddress(IntPtr hModule, String ProcName);
        [DllImport("kernel32.dll")]
        private extern static bool FreeLibrary(IntPtr hModule);
        private static void RegisterDllOcx(string fileName)
        {
            IntPtr hLib = LoadLibrary(fileName);
            if (hLib != IntPtr.Zero)
            {
                IntPtr proc = GetProcAddress(hLib, "DllRegisterServer");
                if (proc != IntPtr.Zero)
                {
                    try
                    {
                        DllRegisterServer drs = (DllRegisterServer)Marshal.GetDelegateForFunctionPointer(proc, typeof(DllRegisterServer));
                        drs();
                    }
                    catch
                    {
                    }
                    finally
                    {
                    }
                }
                FreeLibrary(hLib);
            }
        }
    }
}
