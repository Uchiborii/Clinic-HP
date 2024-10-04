const baseUrl = `https://u-company.cdn.newt.so/v1/blog-547919/post`;
const order = "&order=-dateTime";

async function displayData() {
  const html  = await getPostData(3);
  document.getElementById("result").innerHTML += html;
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
  let html = `<div class="blogs-container">`;
  data.items.forEach((blog) => {
    const date = new Date(blog.dateTime);
    const formattedDate = customFormat(date);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const isNew = date >= sevenDaysAgo;
    const newTag = isNew ? `<div class="tag-font">new!</div>` : "";

    const content = `
			<div class="blog-item">
				<details open>
					<summary>
						<div class="news-date">
								${formattedDate}
						</div>
						<div class="button-flex">
							<div class="center-item">
									${blog.title} 
									${newTag}
							</div>
							<div class="button-img">					
								<img src="img/button.webp" class="button-icon" />						
							</div>
						</div>
					</summary>

					<div class="accordion-content">
						${blog.content}
					</div>
				</details>
			</div>
			`;
    
    html += content; 
  });
  html += `</div>`;
  return html;
}

async function getPostData(_limit) {
  let url = `${baseUrl}?limit=${Number(_limit)}${order}`;
  const data = await fetchData(url);
  const html = await display(data);
  return  html;
}

function toggleNav() {
  var body = document.body;
  body.classList.toggle("nav-open");
}