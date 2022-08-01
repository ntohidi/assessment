import React, { useState, useEffect } from 'react';
import Table from './Table';


function App() {
  const [posts, setData] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = () => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        data.posts.forEach((post) => {
          post.name = `${post.author.name}`;
          post.avatar = `${post.author.avatar}`;
          delete post.author;
        });
        setData(data.posts);
      })
      .catch((error) => console.log('Error fetching posts', error));
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Title',
        accessor: 'title',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Avatar',
        accessor: 'avatar',
      },
      {
        Header: 'Publish Date',
        accessor: 'publishDate',
      },
      {
        Header: 'Summary',
        accessor: 'summary',
      },
    ],
    []
  );

  // This will get called when the table needs new data
  const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current;

    // Set the loading state
    setLoading(true);

    // Only update the data if this is the latest fetch
    if (fetchId === fetchIdRef.current) {
      const startRow = pageSize * pageIndex;
      const endRow = startRow + pageSize;
      setData(posts.slice(startRow, endRow));

      setPageCount(Math.ceil(posts.length / pageSize));

      setLoading(false);
    }
  }, []);

  return (
    <section className='table-holder'>
      <Table
        columns={columns}
        data={posts}
        fetchData={fetchData}
        loading={loading}
        pageCount={pageCount}
      />
    </section>
  );
}

export default App;
