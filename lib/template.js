module.exports = {

  /* 전체적인 HTML 틀 함수 */
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },

  /* 글목록 만드는 함수 */
  list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },

  /* 저자 선택 함수 */
  authorSelect:function(authors, author_id){
    var tag = '';
          for(let i=0; i<authors.length; i++){
            var selected =``;
            if(authors[i].id === author_id){
              selected = ` selected`;
            }
            tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
          }
          return `
            <select name="author">
              ${tag}
            </select>
          `;
  },

  /* 저자 리스팅 함수 */
  authorTable:function(authors){
    var tag ='<table>';
    
    for(let i=0; i<authors.length; i++){
      tag +=
      `
      <tr>
        <td>${authors[i].name}</td>
        <td>${authors[i].profile}</td>
        <td><a href="/author/update?id=${authors[i].id}">update</a></td>
        <td>
          <form action="/author/delete_process" method="post">
            <input type="hidden" name="id" value="${authors[i].id}">
            <input type="submit" value="delete">
          </form>
        </td>
      </tr>
      `
    }
    tag += '</table>';

      return tag;
    }
}
