namespace FKRealSvrOcxTcpSample
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            this.btnClearList = new System.Windows.Forms.Button();
            this.btnClosePort = new System.Windows.Forms.Button();
            this.btnOpenPort = new System.Windows.Forms.Button();
            this.txtHostPort = new System.Windows.Forms.TextBox();
            this.Label1 = new System.Windows.Forms.Label();
            this.txtStatus = new System.Windows.Forms.TextBox();
            this.lblTotal = new System.Windows.Forms.Label();
            this.lvwLogList = new System.Windows.Forms.ListView();
            this.txtActiveId = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.axAxImage1 = new System.Windows.Forms.PictureBox();
            this.AxRealSvrOcxTcp1 = new AxRealSvrOcxTcpLib.AxRealSvrOcxTcp();
            ((System.ComponentModel.ISupportInitialize)(this.axAxImage1)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.AxRealSvrOcxTcp1)).BeginInit();
            this.SuspendLayout();
            // 
            // btnClearList
            // 
            this.btnClearList.Location = new System.Drawing.Point(711, 411);
            this.btnClearList.Name = "btnClearList";
            this.btnClearList.Size = new System.Drawing.Size(92, 29);
            this.btnClearList.TabIndex = 13;
            this.btnClearList.Text = "Clear List";
            this.btnClearList.UseVisualStyleBackColor = true;
            this.btnClearList.Click += new System.EventHandler(this.btnClearList_Click);
            // 
            // btnClosePort
            // 
            this.btnClosePort.Location = new System.Drawing.Point(494, 411);
            this.btnClosePort.Name = "btnClosePort";
            this.btnClosePort.Size = new System.Drawing.Size(92, 29);
            this.btnClosePort.TabIndex = 14;
            this.btnClosePort.Text = "Close Port";
            this.btnClosePort.UseVisualStyleBackColor = true;
            this.btnClosePort.Click += new System.EventHandler(this.btnClosePort_Click);
            // 
            // btnOpenPort
            // 
            this.btnOpenPort.Location = new System.Drawing.Point(359, 411);
            this.btnOpenPort.Name = "btnOpenPort";
            this.btnOpenPort.Size = new System.Drawing.Size(92, 29);
            this.btnOpenPort.TabIndex = 15;
            this.btnOpenPort.Text = "Open Port";
            this.btnOpenPort.UseVisualStyleBackColor = true;
            this.btnOpenPort.Click += new System.EventHandler(this.btnOpenPort_Click);
            // 
            // txtHostPort
            // 
            this.txtHostPort.Location = new System.Drawing.Point(111, 414);
            this.txtHostPort.Name = "txtHostPort";
            this.txtHostPort.Size = new System.Drawing.Size(78, 22);
            this.txtHostPort.TabIndex = 12;
            // 
            // Label1
            // 
            this.Label1.AutoSize = true;
            this.Label1.Location = new System.Drawing.Point(39, 417);
            this.Label1.Name = "Label1";
            this.Label1.Size = new System.Drawing.Size(72, 16);
            this.Label1.TabIndex = 11;
            this.Label1.Text = "Host Port : ";
            // 
            // txtStatus
            // 
            this.txtStatus.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtStatus.Location = new System.Drawing.Point(12, 18);
            this.txtStatus.Name = "txtStatus";
            this.txtStatus.ReadOnly = true;
            this.txtStatus.Size = new System.Drawing.Size(1017, 22);
            this.txtStatus.TabIndex = 10;
            this.txtStatus.Text = "Status";
            this.txtStatus.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // lblTotal
            // 
            this.lblTotal.AutoSize = true;
            this.lblTotal.Location = new System.Drawing.Point(9, 62);
            this.lblTotal.Name = "lblTotal";
            this.lblTotal.Size = new System.Drawing.Size(48, 16);
            this.lblTotal.TabIndex = 9;
            this.lblTotal.Text = "Total : ";
            // 
            // lvwLogList
            // 
            this.lvwLogList.FullRowSelect = true;
            this.lvwLogList.GridLines = true;
            this.lvwLogList.HideSelection = false;
            this.lvwLogList.Location = new System.Drawing.Point(12, 97);
            this.lvwLogList.MultiSelect = false;
            this.lvwLogList.Name = "lvwLogList";
            this.lvwLogList.Size = new System.Drawing.Size(802, 277);
            this.lvwLogList.TabIndex = 8;
            this.lvwLogList.UseCompatibleStateImageBehavior = false;
            this.lvwLogList.View = System.Windows.Forms.View.Details;
            // 
            // txtActiveId
            // 
            this.txtActiveId.Location = new System.Drawing.Point(957, 414);
            this.txtActiveId.Name = "txtActiveId";
            this.txtActiveId.Size = new System.Drawing.Size(78, 22);
            this.txtActiveId.TabIndex = 19;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(852, 417);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(99, 16);
            this.label2.TabIndex = 18;
            this.label2.Text = "Open Door ID : ";
            // 
            // axAxImage1
            // 
            this.axAxImage1.BackColor = System.Drawing.Color.White;
            this.axAxImage1.Location = new System.Drawing.Point(833, 97);
            this.axAxImage1.Name = "axAxImage1";
            this.axAxImage1.Size = new System.Drawing.Size(196, 277);
            this.axAxImage1.TabIndex = 21;
            this.axAxImage1.TabStop = false;
            // 
            // AxRealSvrOcxTcp1
            // 
            this.AxRealSvrOcxTcp1.Enabled = true;
            this.AxRealSvrOcxTcp1.Location = new System.Drawing.Point(537, 46);
            this.AxRealSvrOcxTcp1.Name = "AxRealSvrOcxTcp1";
            this.AxRealSvrOcxTcp1.OcxState = ((System.Windows.Forms.AxHost.State)(resources.GetObject("AxRealSvrOcxTcp1.OcxState")));
            this.AxRealSvrOcxTcp1.Size = new System.Drawing.Size(32, 32);
            this.AxRealSvrOcxTcp1.TabIndex = 22;
            this.AxRealSvrOcxTcp1.Visible = false;
            this.AxRealSvrOcxTcp1.OnReceiveGLogDataExtend += new AxRealSvrOcxTcpLib._DRealSvrOcxTcpEvents_OnReceiveGLogDataExtendEventHandler(this.AxRealSvrOcxTcp1_OnReceiveGLogDataExtend);
            this.AxRealSvrOcxTcp1.OnReceiveGLogTextAndImage += new AxRealSvrOcxTcpLib._DRealSvrOcxTcpEvents_OnReceiveGLogTextAndImageEventHandler(this.AxRealSvrOcxTcp1_OnReceiveGLogTextAndImage);
            this.AxRealSvrOcxTcp1.OnReceiveGLogTextOnDoorOpen += new AxRealSvrOcxTcpLib._DRealSvrOcxTcpEvents_OnReceiveGLogTextOnDoorOpenEventHandler(this.AxRealSvrOcxTcp1_OnReceiveGLogTextOnDoorOpen);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1047, 451);
            this.Controls.Add(this.AxRealSvrOcxTcp1);
            this.Controls.Add(this.axAxImage1);
            this.Controls.Add(this.txtActiveId);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.btnClearList);
            this.Controls.Add(this.btnClosePort);
            this.Controls.Add(this.btnOpenPort);
            this.Controls.Add(this.txtHostPort);
            this.Controls.Add(this.Label1);
            this.Controls.Add(this.txtStatus);
            this.Controls.Add(this.lblTotal);
            this.Controls.Add(this.lvwLogList);
            this.Font = new System.Drawing.Font("Microsoft Sans Serif", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Margin = new System.Windows.Forms.Padding(4);
            this.Name = "Form1";
            this.Text = "FKRealSvrOcxCSSample (ver 2.8.9.0)";
            this.Load += new System.EventHandler(this.Form1_Load);
            ((System.ComponentModel.ISupportInitialize)(this.axAxImage1)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.AxRealSvrOcxTcp1)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        internal System.Windows.Forms.Button btnClearList;
        internal System.Windows.Forms.Button btnClosePort;
        internal System.Windows.Forms.Button btnOpenPort;
        internal System.Windows.Forms.TextBox txtHostPort;
        internal System.Windows.Forms.Label Label1;
        internal System.Windows.Forms.TextBox txtStatus;
        internal System.Windows.Forms.Label lblTotal;
        internal System.Windows.Forms.ListView lvwLogList;
        internal System.Windows.Forms.TextBox txtActiveId;
        internal System.Windows.Forms.Label label2;
        private System.Windows.Forms.PictureBox axAxImage1;
        private AxRealSvrOcxTcpLib.AxRealSvrOcxTcp AxRealSvrOcxTcp1;
    }
}

