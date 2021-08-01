import html from "html-literal";

export default (st) => html`
  <section id="blog">
    ${st.posts
      .map((post) => {
        return formatBlogPost(post);
      })
      .join("")}
  </section>
`;

function formatBlogPost(post) {
  return `
  <div class="blog-post">
    <h2>${post.title}</h2>
    <h5>by User ${post.userId}</h5>
    <p>${post.body}</p>
    <hr>
    <br/>
  </div>`;
}
