using Joycon4CS;
using System;
using System.Drawing;
using System.IO;
using System.Net;
using System.Text;
using System.Windows.Forms;
using System.Threading;

namespace JoyConTest {
    public partial class MainForm : Form {
        public MainForm()
        {
            InitializeComponent();

            server.Prefixes.Add("http://127.0.0.1:2222/");
            server.Prefixes.Add("http://localhost:2222/");
            server.Start();
        }

        HttpListener server = new HttpListener();

        Thread t;
        bool working = true;
        JoyconManager joyconManager = new JoyconManager();


        private void buttonScan_Click(object sender, EventArgs e)
        {
            joyconManager.Scan();
            UpdateDebugType();
            label1.Text = "搜尋裝置成功";
            buttonStart.Enabled = true;
        }

        private void UpdateDebugType()
        {
            foreach (var j in joyconManager.j)
                j.debug_type = Joycon.DebugType.NONE;
        }


        private void buttonStart_Click(object sender, EventArgs e)
        {
            joyconManager.Start();
            timerUpdate.Enabled = true;
            t = new Thread(new ThreadStart(ServerHandler));
            t.Start();
            label1.Text = "開始執行";
        }

        private void timerUpdate_Tick(object sender, EventArgs e)
        {
            joyconManager.Update();
            label1.Text = joyconManager.j[0].GetGyro().ToString();
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            joyconManager.OnApplicationQuit();
            working = false;
            t.Abort();
            server.Stop();
        }
        private void ServerHandler()
        {
            while (working)
            {
                HttpListenerContext context = server.GetContext();
                HttpListenerResponse response = context.Response;
                response.ContentType = "application/json";
                response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept, X-Requested-With");
                response.AddHeader("Access-Control-Allow-Methods", "GET, POST");
                response.AppendHeader("Access-Control-Allow-Origin", "*");
                string something = "[";
                //用迴圈取得多個裝置
                int cnt = joyconManager.j.Count;
                for (int i = 0; i < cnt; i++)
                {
                    var j = joyconManager.j[i];
                    something += JoyconToString(j);
                    if (i != cnt - 1) something += ",";
                }
                something += "]";
                byte[] buffer = Encoding.UTF8.GetBytes(something);
                response.ContentLength64 = buffer.Length;
                Stream st = response.OutputStream;
                st.Write(buffer, 0, buffer.Length);
                context.Response.Close();
                Thread.Sleep(1);
            }
        }
        public string JoyconToString(Joycon j)
        {
            var hands = j.isLeft ? "Left" : "Right";
            var quaternion = j.GetVector();
            float x = (float)(quaternion.eulerAngles.X * 180.0f / Math.PI);
            float y = (float)(quaternion.eulerAngles.Y * 180.0f / Math.PI);
            float z = (float)(quaternion.eulerAngles.Z * 180.0f / Math.PI);
            Vector3 rotate = new Vector3(x, y, z);
            Vector3 gyro = j.GetGyro();
            string result = "{\"hands\":\"" + hands + "\",\"gyro\":{\"X\":" + gyro.X + ",\"Y\":" + gyro.Y + ",\"Z\":" + gyro.Z + "},\"rotate\":{\"X\":" + rotate.X + ",\"Y\":" + rotate.Y + ",\"Z\":" + rotate.Z + "}}";
            return result;
        }
    }
}