// 필요한 모듈 가져오기
const http = require('http');

// 서버 생성
const server = http.createServer((req, res) => {
  // 응답 헤더 설정
  res.statusCode = 200; // 성공 상태 코드
  res.setHeader('Content-Type', 'text/plain'); // 응답 콘텐츠 타입

  // 응답 본문
  res.end('Hello, Node.js Server!');
});

// 서버를 특정 포트에서 실행
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
