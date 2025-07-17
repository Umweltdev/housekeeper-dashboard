import { Helmet } from 'react-helmet-async';

import { useGetEvents } from 'src/api/events';

import { PostListView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function ProductListPage() {
  const { events, eventsLoading, refreshEvents } = useGetEvents();

  return (
    <>
      <Helmet>
        <title> Dashboard: Product List</title>
      </Helmet>

      <PostListView
        posts={events}
        postsLoading={eventsLoading}
        refreshPosts={refreshEvents}
        route="event"
      />
    </>
  );
}
