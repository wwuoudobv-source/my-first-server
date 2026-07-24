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
          background: linear-gradient(to bottom, #e8f5e9, #c8e6c9);
          text-align: center;
          overflow: hidden;
        }

        h1 {
          color: #2e7d32;
          margin-top: 20px;
        }

        table {
          margin: 20px auto;
          border-collapse: collapse;
          width: 60%;
          background: white;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          border-radius: 10px;
          overflow: hidden;
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

        /* 🍃 ใบไม้ */
        .leaf {
          position: fixed;
          top: -50px;
          font-size: 24px;
          animation: fall linear infinite;
        }

        @keyframes fall {
          to {
            transform: translateY(110vh) rotate(360deg);
          }
        }
      </style>
    </head>
    <body>

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
