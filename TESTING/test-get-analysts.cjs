const http = require('http');

// Step 1: Login as gestor
const loginData = JSON.stringify({
  email: 'gestor@halalsphere.com',
  password: 'senha123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 3333,
  path: '/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

console.log('🔐 Fazendo login como gestor...\n');

const loginReq = http.request(loginOptions, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);

      if (response.token || (response.data && response.data.token)) {
        const token = response.token || response.data.token;
        console.log('✅ Login realizado com sucesso!\n');

        // Step 2: Get analysts
        console.log('📋 Chamando GET /auth/users?role=analista...\n');

        const analystsOptions = {
          hostname: 'localhost',
          port: 3333,
          path: '/auth/users?role=analista',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        const analystsReq = http.request(analystsOptions, (res) => {
          let analystsData = '';

          res.on('data', (chunk) => {
            analystsData += chunk;
          });

          res.on('end', () => {
            console.log('📊 Resposta da API:\n');
            console.log(analystsData);

            try {
              const analystsResponse = JSON.parse(analystsData);
              console.log('\n\n📝 Dados parseados:');
              console.log(JSON.stringify(analystsResponse, null, 2));

              const analysts = Array.isArray(analystsResponse)
                ? analystsResponse
                : (analystsResponse.data || []);

              console.log(`\n\n✨ Total de analistas: ${analysts.length}`);

              if (analysts.length > 0) {
                analysts.forEach((analyst, index) => {
                  console.log(`\n${index + 1}. ${analyst.name}`);
                  console.log(`   Email: ${analyst.email}`);
                  console.log(`   ID: ${analyst.id}`);
                  console.log(`   Role: ${analyst.role}`);
                  console.log(`   Phone: ${analyst.phone || 'NULL'}`);
                });
              } else {
                console.log('❌ Nenhum analista retornado pela API!');
              }
            } catch (e) {
              console.error('❌ Erro ao parsear JSON:', e.message);
            }
          });
        });

        analystsReq.on('error', (error) => {
          console.error('❌ Erro na requisição:', error.message);
        });

        analystsReq.end();

      } else {
        console.log('❌ Erro no login:', JSON.stringify(response, null, 2));
      }
    } catch (e) {
      console.error('❌ Erro ao parsear resposta do login:', e.message);
      console.log('Resposta bruta:', data);
    }
  });
});

loginReq.on('error', (error) => {
  console.error('❌ Erro na requisição de login:', error.message);
});

loginReq.write(loginData);
loginReq.end();
