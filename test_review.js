async function run() {
  try {
    const loginRes = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'analyst_prime', password: 'password', role: 'ANALISTA' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    const subsRes = await fetch('http://localhost:8080/api/submissions?contestId=1', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const subs = await subsRes.json();
    console.log("Submissions for contest 1:", subs.length);
    
    if (subs.length > 0) {
      const subId = subs[0].id;
      console.log("Testing review on submission:", subId);
      const reviewRes = await fetch(`http://localhost:8080/api/submissions/${subId}/review`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          status: 'ACCEPTED',
          grade: 9.5,
          feedbackNote: ''
        })
      });
      console.log("Review status:", reviewRes.status);
      console.log("Review response:", await reviewRes.text());
    }

  } catch (e) {
    console.error(e);
  }
}
run();
