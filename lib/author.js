var db = require(`./db`);
var template = require('./template');
var qs = require('querystring');
var url = require('url');

exports.home = function(request, response){
  db.query(`SELECT * FROM topic`, function(error, topics){
    db.query(`SELECT * FROM author`, function(error2, authors){

      if(error){
        throw error;
      }

      
      var title = 'author';
      
    
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `
        ${template.authorTable(authors)}
        <style>
          table{ border-collapse: collapse;}
          td{ border: 1px solid black;}
        </style>
        
        <form action="/author/create_process" method="post">
          <p>
            <input type="text" name="name" placeholder="name"></input>
          </p>
          <p>
            <textarea name="profile" placeholder="profile"></textarea>
          </p>
          <p>
            <input type="submit" value="create">
        </form>
        `,
        ``
      );
      response.writeHead(200);
      response.end(html);

    })
  });
}

/* create 버튼 눌렀을 때 처리 후 redirect 페이지 */
exports.create_process = function(request, response){
  var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);

          db.query('INSERT INTO author (name, profile) VALUES(?, ?)',
          [post.name, post.profile], (error, result)=>{
            if(error){
              throw error;
            }
            else{
              response.writeHead(302, {Location: `/author`});
              response.end();
            }
          })
      });
}

/* update 링크 눌렀을 때 페이지  */
exports.update = function(request, response){
  db.query(`SELECT * FROM topic`, function(error, topics){
    db.query(`SELECT * FROM author`, function(error2, authors){

      var _url = request.url;
      var queryData = url.parse(_url, true).query;

      db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function(error3, author){

        var title = 'author';
        
      
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `
          ${template.authorTable(authors)}
          <style>
            table{ border-collapse: collapse;}
            td{ border: 1px solid black;}
          </style>
          
          <form action="/author/update_process" method="post">
            <p>
              <input type="hidden" name="id" value="${queryData.id}"></input>
            </p>
            <p>
              <input type="text" name="name" value="${author[0].name}"></input>
            </p>
            <p>
              <textarea name="profile">${author[0].profile}</textarea>
            </p>
            <p>
              <input type="submit" value="update">
          </form>
          `,
          ``
        );
        response.writeHead(200);
        response.end(html);
      })
      

    })
  });
}

/* update 버튼 눌렀을 때 처리 후 redirect 페이지 */
exports.update_process = function(request, response){
  var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);

          db.query('UPDATE author SET name=?, profile=? WHERE id=?',
          [post.name, post.profile, post.id], (error, result)=>{
            if(error){
              throw error;
            }
            else{
              response.writeHead(302, {Location: `/author`});
              response.end();
            }
          })
      });
}

/* delete 버튼 눌렀을 때 처리 후 홈페이지 */
exports.delete_process = function(request, response){
  var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(`DELETE FROM topic WHERE author_id=?`, [post.id],  (error1, result1)=>{
            if(error1){
              throw error1;
            }

            db.query(`DELETE FROM author WHERE id=?`, [post.id], (error2, result2)=>{
              if (error2){
                throw error2;
              }
              response.writeHead(302, {Location: `/author`});
              response.end();
            });
          });
          
      });
}