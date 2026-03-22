import { Link } from 'react-router';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Listings() {
  // Mock listings data
  const listings = [
    {
      id: 1,
      title: 'iPhone 13 Pro - Excellent Condition',
      category: 'Marketplace',
      price: 650,
      views: 42,
      messages: 8,
      status: 'active',
      postedDate: 'March 15, 2026',
      image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcGhvbmUlMjAxM3xlbnwwfHx8fDE3MTMzNjc1MDB8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 2,
      title: 'Studio Apartment Near Campus',
      category: 'Housing',
      price: 850,
      views: 127,
      messages: 23,
      status: 'active',
      postedDate: 'March 10, 2026',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBzdHVkaW98ZW58MHx8fHwxNzEzMzY3NTAwfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 3,
      title: 'Calculus Textbook 8th Edition',
      category: 'Marketplace',
      price: 45,
      views: 18,
      messages: 3,
      status: 'sold',
      postedDate: 'March 5, 2026',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0Ym9va3xlbnwwfHx8fDE3MTMzNjc1MDB8MA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  return (
    <div 
      className="w-full min-h-screen"
      style={{ 
        backgroundColor: '#F9FAFB',
        padding: '48px 24px'
      }}
    >
      <div 
        className="mx-auto"
        style={{ 
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 
              className="font-bold"
              style={{
                fontSize: '56px',
                color: '#0F172A',
                marginBottom: '8px',
                lineHeight: '1.1'
              }}
            >
              My Listings
            </h1>
            <p 
              className="font-normal"
              style={{
                fontSize: '16px',
                color: '#64748B',
                lineHeight: '1.6'
              }}
            >
              Manage your posted items
            </p>
          </div>
          <Link to="/post">
            <button
              className="font-semibold transition-all flex items-center"
              style={{
                backgroundColor: '#F76902',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                border: 'none',
                cursor: 'pointer',
                gap: '8px',
                transitionDuration: '200ms',
                boxShadow: '0 2px 8px rgba(247, 105, 2, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D55A02';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(247, 105, 2, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F76902';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(247, 105, 2, 0.3)';
              }}
            >
              <Plus size={20} />
              New Listing
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div 
          className="grid gap-[24px]"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
        >
          <div
            className="bg-white"
            style={{
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              padding: '24px'
            }}
          >
            <p 
              className="font-normal"
              style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}
            >
              Active Listings
            </p>
            <p 
              className="font-bold"
              style={{ fontSize: '32px', color: '#111827' }}
            >
              2
            </p>
          </div>
          <div
            className="bg-white"
            style={{
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              padding: '24px'
            }}
          >
            <p 
              className="font-normal"
              style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}
            >
              Total Views
            </p>
            <p 
              className="font-bold"
              style={{ fontSize: '32px', color: '#111827' }}
            >
              187
            </p>
          </div>
          <div
            className="bg-white"
            style={{
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              padding: '24px'
            }}
          >
            <p 
              className="font-normal"
              style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}
            >
              Messages
            </p>
            <p 
              className="font-bold"
              style={{ fontSize: '32px', color: '#111827' }}
            >
              34
            </p>
          </div>
        </div>

        {/* Listings Table */}
        <div
          className="bg-white"
          style={{
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            overflow: 'hidden'
          }}
        >
          {/* Table Header */}
          <div
            className="grid items-center"
            style={{
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
              padding: '16px 24px',
              borderBottom: '1px solid #E5E7EB',
              backgroundColor: '#F9FAFB',
              gap: '16px'
            }}
          >
            <span className="font-semibold" style={{ fontSize: '14px', color: '#6B7280' }}>
              Listing
            </span>
            <span className="font-semibold" style={{ fontSize: '14px', color: '#6B7280' }}>
              Category
            </span>
            <span className="font-semibold" style={{ fontSize: '14px', color: '#6B7280' }}>
              Price
            </span>
            <span className="font-semibold" style={{ fontSize: '14px', color: '#6B7280' }}>
              Views
            </span>
            <span className="font-semibold" style={{ fontSize: '14px', color: '#6B7280' }}>
              Status
            </span>
            <span className="font-semibold" style={{ fontSize: '14px', color: '#6B7280' }}>
              Actions
            </span>
          </div>

          {/* Table Rows */}
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="grid items-center hover:bg-gray-50 transition-colors"
              style={{
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr auto',
                padding: '16px 24px',
                borderBottom: '1px solid #E5E7EB',
                gap: '16px'
              }}
            >
              {/* Listing with Thumbnail */}
              <div className="flex items-center" style={{ gap: '12px' }}>
                {/* Thumbnail Image */}
                <div 
                  style={{ 
                    width: '56px', 
                    height: '56px',
                    flexShrink: 0,
                    overflow: 'hidden',
                    borderRadius: '8px',
                    backgroundColor: '#F3F4F6'
                  }}
                >
                  <ImageWithFallback
                    src={listing.image}
                    alt={listing.title}
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* Title and Date */}
                <div>
                  <p 
                    className="font-medium"
                    style={{ fontSize: '15px', color: '#111827', marginBottom: '4px' }}
                  >
                    {listing.title}
                  </p>
                  <p 
                    className="font-normal"
                    style={{ fontSize: '13px', color: '#9CA3AF' }}
                  >
                    Posted {listing.postedDate}
                  </p>
                </div>
              </div>

              <span 
                className="font-normal"
                style={{ fontSize: '14px', color: '#6B7280' }}
              >
                {listing.category}
              </span>

              <span 
                className="font-semibold"
                style={{ fontSize: '15px', color: '#111827' }}
              >
                ${listing.price}
              </span>

              <div className="flex items-center" style={{ gap: '6px' }}>
                <Eye size={14} style={{ color: '#9CA3AF' }} />
                <span className="font-normal" style={{ fontSize: '14px', color: '#6B7280' }}>
                  {listing.views}
                </span>
              </div>

              <span
                className="font-medium inline-block"
                style={{
                  fontSize: '13px',
                  color: listing.status === 'active' ? '#059669' : '#6B7280',
                  backgroundColor: listing.status === 'active' ? '#D1FAE5' : '#F3F4F6',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  textTransform: 'capitalize',
                  width: 'fit-content'
                }}
              >
                {listing.status}
              </span>

              <div className="flex items-center" style={{ gap: '8px' }}>
                <button
                  className="flex items-center justify-center hover:opacity-70 transition-opacity"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                  title="Edit"
                >
                  <Edit size={14} style={{ color: '#6B7280' }} />
                </button>
                <button
                  className="flex items-center justify-center hover:opacity-70 transition-opacity"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                  title="Delete"
                >
                  <Trash2 size={14} style={{ color: '#EF4444' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}