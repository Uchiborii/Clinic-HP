const baseUrl = `https://u-company.cdn.newt.so/v1/blog-547919/post`;
const order = "&order=-dateTime";

async function displayData() {
  const { html, data } = await getPostData(3);
  document.getElementById("result").innerHTML += html;

  const max_page = data.total && data.limit ? Math.ceil(Number(data.total) / Number(data.limit)) : 1;

  const content = `<div class="news-top">
	<nav aria-label="Page navigation example">
	<ul class="pagination">
	<li class="page-item">
	${page > 1 ? `<li class="page-item"><a class="page-link" href="news.html?page=${page - 1}" aria-label="Previous"><span aria-hidden="true">&laquo; 前へ　</span></a></li>` : ""}
	</a>
	</li>
	
	<li class="page-item">
	${page < max_page ? `<li class="page-item"><a class="page-link" href="news.html?page=${page + 1}" aria-label="Next"><span aria-hidden="true">　次へ &raquo;</span></a></li>` : ""}
	</a>
	</li>
	</ul>
	</nav>`;
  document.getElementById("result").innerHTML += content;
}

function customFormat(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const week = date.getDay();
  const weekItems = ["(日)", "(月)", "(火)", "(水)", "(木)", "(金)", "(土)"];
  const dayOfWeek = weekItems[week];

  return `${year}/${month}/${day}${dayOfWeek}`;
}

async function fetchData(url) {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: "Bearer JhOWeg9Xp1lXjsUp-asOWwnKLjrhYgSZdeJf5gvOZko",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        window.location.href = "index.html";
        return;
      } else {
        const errorLog = data.message;
        let url = `error.html?message=${errorLog}`;
        window.location.href = url;
        return false;
      }
    }
    return data;
  } catch (error) {
    console.error("エラー:", error);
  }
}

function display(data) {
  let html = `<div class="blogs-container">`;  // 親コンテナを追加
  data.items.forEach((blog) => {
    const date = new Date(blog.dateTime);
    const formattedDate = customFormat(date);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const isNew = date >= sevenDaysAgo;
    const newTag = isNew ? `<div class="bg-white text-danger rounded-pill m-3 h6">new!</div>` : "";

    const content = `
    <div class="blog-item">
      <a class="list-item" href="detail.html?id=${blog._id}">
        <div class="news-date">
          ${formattedDate}
        </div>
        <div class="center-item">
          ${blog.title}
          ${newTag}			
        </div>
        <div class="button-img">					
          <img src="img/button.webp" class="button-icon" />						
        </div>
      </a>
      <div>
        ${blog.content}
      </div>
    </div>`;
    
    html += content;  // 各ブログ記事を追加
  });
  html += `</div>`;  // 親コンテナを閉じる
  return html;
}

async function getPostData(_limit) {
  const skip = (page - 1) * Number(_limit);
  let url = `${baseUrl}?limit=${Number(_limit)}${order}&skip=${skip}&page=${page}`;
  const data = await fetchData(url);
  const html = await display(data);
  return { html, data };
}

async function allArticles() {
  var resultList = [];
  let processA = await fetchData(`${baseUrl}?limit=5${order}`);
  let processB = await fetchData(`${baseUrl}?limit=5${order}`);
  let processC = await fetchData(`${baseUrl}?limit=5${order}`);
  let processD = await fetchData(`${baseUrl}?limit=5${order}`);

  resultList.push(processA);
  resultList.push(processB);
  resultList.push(processC);
  resultList.push(processD);

  return resultList;
}

async function newPost() {
  document.getElementById("result").innerHTML = "";
  const limit = 5;
  let url = `${baseUrl}?limit=${limit}${order}`;
  const data = await fetchData(url);
  const html = await display(data);
  document.getElementById("result").innerHTML += html;
}

async function catchEndUrl() {
  const params = new URLSearchParams(window.location.search);
  return params;
}

let page;

async function startCatchUrl() {
  catchEndUrl().then((params) => {
    page = params.get("page") ? Number(params.get("page")) : 1;
    displayData();
  });
}
