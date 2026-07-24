const http = require('http');
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const port = process.env.PORT || 3000;
const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM students');
    client.release();
    let html = `
    <!DOCTYPE html>
    <html lang="th">
    <head>
      <meta charset="UTF-8">
      <title>ฐานข้อมูลนักศึกษา</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(to bottom, #87ceeb 0%, #b3e5fc 25%, #e8f5e9 55%, #c8e6c9 100%);
          text-align: center;
          overflow: hidden;
          position: relative;
          min-height: 100vh;
          margin: 0;
        }
        h1 {
          color: #2e7d32;
          margin-top: 20px;
          position: relative;
          z-index: 10;
        }
        table {
          margin: 20px auto;
          border-collapse: collapse;
          width: 60%;
          background: white;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          z-index: 10;
        }
        th {
          background: #4caf50;
          color: white;
          padding: 12px;
        }
        td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        tr:hover {
          background: #f1f8e9;
        }

        /* ☀️ พระอาทิตย์ */
        .sun {
          position: fixed;
          top: 40px;
          right: 80px;
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, #fff59d 0%, #ffeb3b 60%, #ffc107 100%);
          border-radius: 50%;
          box-shadow: 0 0 40px 20px rgba(255, 235, 59, 0.6);
          animation: glow 3s ease-in-out infinite;
          z-index: 1;
        }
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 40px 20px rgba(255, 235, 59, 0.6);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 60px 35px rgba(255, 235, 59, 0.85);
            transform: scale(1.05);
          }
        }
        .ray {
          position: fixed;
          top: 40px;
          right: 80px;
          width: 80px;
          height: 80px;
          z-index: 0;
          animation: spin 20s linear infinite;
        }
        .ray::before {
          content: '';
          position: absolute;
          top: -30px;
          left: -30px;
          width: 140px;
          height: 140px;
          background: repeating-conic-gradient(
            rgba(255, 235, 59, 0.35) 0deg 8deg,
            transparent 8deg 24deg
          );
          border-radius: 50%;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* ☁️ ก้อนเมฆ */
        .cloud {
          position: fixed;
          background: #fff;
          border-radius: 50px;
          opacity: 0.85;
          z-index: 1;
          animation: drift linear infinite;
        }
        .cloud::before, .cloud::after {
          content: '';
          position: absolute;
          background: #fff;
          border-radius: 50%;
        }
        .cloud::before {
          width: 60%;
          height: 140%;
          top: -60%;
          left: 8%;
        }
        .cloud::after {
          width: 45%;
          height: 110%;
          top: -45%;
          right: 10%;
        }
        @keyframes drift {
          from { transform: translateX(-150px); }
          to { transform: translateX(110vw); }
        }

        /* 🌳 ต้นไม้ */
        .tree {
          position: fixed;
          bottom: 0;
          font-size: 70px;
          transform-origin: bottom center;
          animation: sway ease-in-out infinite;
          z-index: 2;
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }

        /* 🌸 ดอกไม้ */
        .flower {
          position: fixed;
          bottom: 10px;
          font-size: 28px;
          transform-origin: bottom center;
          animation: bloom ease-in-out infinite;
          z-index: 2;
        }
        @keyframes bloom {
          0%, 100% { transform: scale(1) rotate(-6deg); }
          50% { transform: scale(1.15) rotate(6deg); }
        }

        /* 🍃 ใบไม้ */
        .leaf {
          position: fixed;
          top: -50px;
          font-size: 24px;
          animation: fall linear infinite;
          z-index: 3;
        }
        @keyframes fall {
          to {
            transform: translateY(110vh) rotate(360deg);
          }
        }
      </style>
    </head>
    <body>
    <div class="sun"></div>
    <div class="ray"></div>
    `;

    // ☁️ สร้างก้อนเมฆ
    for (let i = 0; i < 5; i++) {
      const top = 20 + Math.random() * 100;
      const width = 100 + Math.random() * 80;
      const height = width * 0.4;
      const duration = 25 + Math.random() * 20;
      const delay = Math.random() * -30;
      html += `
      <div class="cloud" style="
        top: ${top}px;
        width: ${width}px;
        height: ${height}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
      "></div>
      `;
    }

    // 🌳 สร้างต้นไม้
    const treePositions = [3, 12, 88, 95];
    treePositions.forEach((left, i) => {
      const duration = 4 + Math.random() * 2;
      html += `
      <div class="tree" style="
        left: ${left}%;
        animation-duration: ${duration}s;
      ">🌳</div>
      `;
    });

    // 🌸 สร้างดอกไม้
    for (let i = 0; i < 10; i++) {
      const left = Math.random() * 100;
      const duration = 2 + Math.random() * 2;
      const delay = Math.random() * -4;
      const flowerEmoji = ['🌸', '🌼', '🌷', '🌺'][Math.floor(Math.random() * 4)];
      html += `
      <div class="flower" style="
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
      ">${flowerEmoji}</div>
      `;
    }

    html += `
    <h1>🌿 ฐานข้อมูลนักศึกษา 🌿</h1>
    <table>
      <tr>
        <th>รหัสนักศึกษา</th>
        <th>ชื่อ-นามสกุล</th>
      </tr>
    `;
    result.rows.forEach(row => {
      html += `
      <tr>
        <td>${row.student_id}</td>
        <td>${row.student_name}</td>
      </tr>
      `;
    });
    html += `</table>`;

    // 🍃 สร้างใบไม้ร่วง
    for (let i = 0; i < 20; i++) {
      const left = Math.random() * 100;
      const duration = 5 + Math.random() * 5;
      html += `
      <div class="leaf" style="
        left: ${left}%;
        animation-duration: ${duration}s;
      ">🍃</div>
      `;
    }
    html += `
    </body>
    </html>
    `;
    res.end(html);
  } catch (err) {
    console.error(err);
    res.end(`<h1>เกิดข้อผิดพลาด!</h1><p>${err.message}</p>`);
  }
});
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
