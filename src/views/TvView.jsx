import PagedView from './PagedView.jsx';

export default function TvView() {
  return <PagedView title="Popular TV Shows" endpoint="/tv/popular" type="tv" />;
}
