import { useParams } from 'react-router-dom';

function SiteDetailPage() {
  const { id } = useParams();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Site Detail</h1>
      <p>Showing details for site ID: {id}</p>
    </div>
  );
}

export default SiteDetailPage;