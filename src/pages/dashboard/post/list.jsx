import { Helmet } from 'react-helmet-async';

import { PostListView } from 'src/sections/blog/view';
import { useGetPosts } from 'src/api/blog';

// ----------------------------------------------------------------------

export default function PostListPage() {
  const { posts, postsLoading, refreshPosts } = useGetPosts();
  return (
    <>
      <Helmet>
        <title> Dashboard: Post List</title>
      </Helmet>

      <PostListView posts={posts} postsLoading={postsLoading} refreshPosts={refreshPosts} />
    </>
  );
}
