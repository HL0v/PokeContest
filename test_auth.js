async function run() {
  try {
    const loginRes = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'analyst_prime', password: 'password', role: 'ANALISTA' })
    });
    const loginData = await loginRes.json();
    console.log("Login Token:", loginData.token);
    
    if (!loginData.token) {
        console.log("NO TOKEN RETURNED!", loginData);
        return;
    }

    const statsRes = await fetch('http://localhost:8080/api/analyst/stats', {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    
    console.log("Stats Status:", statsRes.status);
    if (!statsRes.ok) {
       console.log(await statsRes.text());
    }
    
    const subsRes = await fetch('http://localhost:8080/api/submissions?status=PENDING', {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    
    console.log("Subs Status:", subsRes.status);
    if (!subsRes.ok) {
       console.log(await subsRes.text());
    }

  } catch (e) {
    console.error(e);
  }
}
run();
