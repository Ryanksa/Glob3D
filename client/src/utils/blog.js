import { fetchGraphql } from './fetchService';

const createBlog = (title, content) => {
  return fetchGraphql(`
    query{
      getUserPosition
    }
  `)
  .then(({ data }) => {
    return fetchGraphql(`
      mutation {
        createBlog(title: ${title}, 
                  content: ${content},
                  position: [${data.getUserPosition[0]}, ${data.getUserPosition[1]}]) {
          _id
        }
      }
    `);
  });
};

const getBlog = (blogId, title, content, date, author) => {
  return fetchGraphql(`
    query {
      blogs(first: 1, after: 0, blogId: "${blogId}") {
        _id
        ${title && "title"}
        ${content && "content"}
        ${date && "date"}
        ${author && "author { name email }"}
      }
    }
  `);
};

export { createBlog, getBlog };