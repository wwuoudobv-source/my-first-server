const http = require('http');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const port = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  let client;

  try {
    client = await pool.connect();
    const result = await client.query('SELECT * FROM students');

    let html = `<h1>ฐานข้อมูลนักศึกษา (ทดสอบการเชื่อมต่อ)</h1>`;
    html += `<table border="1" cellpadding="10">`;
    html += `<tr><th>รหัสนักศึกษา</th><th>ชื่อ-นามสกุล</th></tr>`;

    // แสดงข้อมูลจาก database จริง
    result.rows.forEach(row => {
      html += `<tr>
        <td>${row.student_id}</td>
        <td>${row.student_name}</td>
      </tr>`;
    });

    // ✅ เพิ่มข้อมูลเดิมของคุณเข้าไป (fix ค่าให้แสดงแน่นอน)
    html += `<tr>
      <td>69319010212</td>
      <td>พงษ์ธารินทร์ หาแก้ว</td>
    </tr>`;

    html += `</table>`;
    res.end(html);

  } catch (err) {
    console.error(err);
    res.end(`<h1>เกิดข้อผิดพลาด!</h1><p>${err.message}</p>`);
  } finally {
    if (client) client.release();
  }
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
