import { useState } from 'react';
import { Upload, X } from 'lucide-react';

export function Post() {
  const [category, setCategory] = useState<'housing' | 'marketplace'>('marketplace');
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Mock image upload - in production would upload to storage
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      // Limit to 5 photos total
      const remainingSlots = 5 - images.length;
      const imagesToAdd = newImages.slice(0, remainingSlots);
      setImages([...images, ...imagesToAdd]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

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
          maxWidth: '800px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}
      >
        {/* Page Title */}
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
            Create New Listing
          </h1>
          <p 
            className="font-normal"
            style={{
              fontSize: '16px',
              color: '#64748B',
              lineHeight: '1.6'
            }}
          >
            Share what you're offering with the RIT community
          </p>
        </div>

        {/* Post Form Card */}
        <div
          className="bg-white"
          style={{
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '32px'
          }}
        >
          <form style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Category Selection */}
            <div>
              <label 
                className="font-semibold"
                style={{
                  fontSize: '14px',
                  color: '#111827',
                  display: 'block',
                  marginBottom: '12px'
                }}
              >
                Category
              </label>
              <div 
                className="flex"
                style={{ 
                  gap: '4px',
                  padding: '6px',
                  backgroundColor: '#F3F4F6',
                  borderRadius: '14px',
                  width: 'fit-content'
                }}
              >
                <button
                  type="button"
                  onClick={() => setCategory('marketplace')}
                  className="flex-1 font-semibold transition-all"
                  style={{
                    padding: '16px 36px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: category === 'marketplace' ? '#F76902' : 'transparent',
                    color: category === 'marketplace' ? '#FFFFFF' : '#6B7280',
                    fontSize: '15px',
                    cursor: 'pointer',
                    transitionProperty: 'all',
                    transitionDuration: '250ms',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    minWidth: '150px',
                    boxShadow: category === 'marketplace' ? '0 4px 12px rgba(247, 105, 2, 0.3)' : 'none',
                    transform: category === 'marketplace' ? 'translateY(-1px)' : 'translateY(0)'
                  }}
                  onMouseEnter={(e) => {
                    if (category !== 'marketplace') {
                      e.currentTarget.style.color = '#111827';
                      e.currentTarget.style.backgroundColor = '#E5E7EB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (category !== 'marketplace') {
                      e.currentTarget.style.color = '#6B7280';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  Marketplace
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('housing')}
                  className="flex-1 font-semibold transition-all"
                  style={{
                    padding: '16px 36px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: category === 'housing' ? '#F76902' : 'transparent',
                    color: category === 'housing' ? '#FFFFFF' : '#6B7280',
                    fontSize: '15px',
                    cursor: 'pointer',
                    transitionProperty: 'all',
                    transitionDuration: '250ms',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    minWidth: '150px',
                    boxShadow: category === 'housing' ? '0 4px 12px rgba(247, 105, 2, 0.3)' : 'none',
                    transform: category === 'housing' ? 'translateY(-1px)' : 'translateY(0)'
                  }}
                  onMouseEnter={(e) => {
                    if (category !== 'housing') {
                      e.currentTarget.style.color = '#111827';
                      e.currentTarget.style.backgroundColor = '#E5E7EB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (category !== 'housing') {
                      e.currentTarget.style.color = '#6B7280';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  Housing
                </button>
              </div>
            </div>

            {/* SECTION: Basic Info */}
            <div style={{ marginTop: '16px' }}>
              <h3 
                className="font-semibold"
                style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '24px'
                }}
              >
                Basic Info
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Title */}
                <div>
                  <label 
                    className="font-semibold"
                    style={{
                      fontSize: '14px',
                      color: '#111827',
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., iPhone 13 Pro, Studio Apartment, Textbook"
                    className="w-full outline-none"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '16px',
                      color: '#111827'
                    }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label 
                    className="font-semibold"
                    style={{
                      fontSize: '14px',
                      color: '#111827',
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    placeholder="Provide details about your listing..."
                    rows={6}
                    className="w-full outline-none"
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      fontSize: '16px',
                      color: '#111827',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* SECTION: Details */}
            <div style={{ marginTop: '16px' }}>
              <h3 
                className="font-semibold"
                style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '24px'
                }}
              >
                Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Price */}
                <div>
                  <label 
                    className="font-semibold"
                    style={{
                      fontSize: '14px',
                      color: '#111827',
                      display: 'block',
                      marginBottom: '8px'
                    }}
                  >
                    {category === 'housing' ? 'Rent (per month)' : 'Price'}
                  </label>
                  <div className="relative">
                    <span
                      className="absolute font-normal"
                      style={{
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#6B7280',
                        fontSize: '16px'
                      }}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full outline-none"
                      style={{
                        padding: '12px 16px 12px 32px',
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        fontSize: '16px',
                        color: '#111827'
                      }}
                    />
                  </div>
                </div>

                {/* Conditional Housing Fields */}
                {category === 'housing' && (
                  <>
                    {/* Location */}
                    <div>
                      <label 
                        className="font-semibold"
                        style={{
                          fontSize: '14px',
                          color: '#111827',
                          display: 'block',
                          marginBottom: '8px'
                        }}
                      >
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Park Point, Riverknoll, Off-campus"
                        className="w-full outline-none"
                        style={{
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB',
                          fontSize: '16px',
                          color: '#111827'
                        }}
                      />
                    </div>

                    {/* Bedrooms & Bathrooms */}
                    <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                      <div>
                        <label 
                          className="font-semibold"
                          style={{
                            fontSize: '14px',
                            color: '#111827',
                            display: 'block',
                            marginBottom: '8px'
                          }}
                        >
                          Bedrooms
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full outline-none"
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB',
                            fontSize: '16px',
                            color: '#111827'
                          }}
                        />
                      </div>
                      <div>
                        <label 
                          className="font-semibold"
                          style={{
                            fontSize: '14px',
                            color: '#111827',
                            display: 'block',
                            marginBottom: '8px'
                          }}
                        >
                          Bathrooms
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          className="w-full outline-none"
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB',
                            fontSize: '16px',
                            color: '#111827'
                          }}
                        />
                      </div>
                    </div>

                    {/* Gender Preference */}
                    <div>
                      <label 
                        className="font-semibold"
                        style={{
                          fontSize: '14px',
                          color: '#111827',
                          display: 'block',
                          marginBottom: '8px'
                        }}
                      >
                        Gender Preference
                      </label>
                      <select
                        className="w-full outline-none"
                        style={{
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB',
                          fontSize: '16px',
                          color: '#111827',
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        <option>No Preference</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Conditional Marketplace Fields */}
                {category === 'marketplace' && (
                  <div>
                    <label 
                      className="font-semibold"
                      style={{
                        fontSize: '14px',
                        color: '#111827',
                        display: 'block',
                        marginBottom: '8px'
                      }}
                    >
                      Condition
                    </label>
                    <select
                      className="w-full outline-none"
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        fontSize: '16px',
                        color: '#111827',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <option>New</option>
                      <option>Like New</option>
                      <option>Good</option>
                      <option>Fair</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION: Availability (Housing only) */}
            {category === 'housing' && (
              <div style={{ marginTop: '16px' }}>
                <h3 
                  className="font-semibold"
                  style={{
                    fontSize: '13px',
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '24px'
                  }}
                >
                  Availability
                </h3>

                <div className="grid grid-cols-2" style={{ gap: '16px' }}>
                  {/* Available From */}
                  <div>
                    <label 
                      className="font-semibold"
                      style={{
                        fontSize: '14px',
                        color: '#111827',
                        display: 'block',
                        marginBottom: '8px'
                      }}
                    >
                      Available From
                    </label>
                    <input
                      type="date"
                      className="w-full outline-none"
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        fontSize: '16px',
                        color: '#111827'
                      }}
                    />
                  </div>

                  {/* Available To */}
                  <div>
                    <label 
                      className="font-semibold"
                      style={{
                        fontSize: '14px',
                        color: '#111827',
                        display: 'block',
                        marginBottom: '8px'
                      }}
                    >
                      Available To
                    </label>
                    <input
                      type="date"
                      className="w-full outline-none"
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #E5E7EB',
                        fontSize: '16px',
                        color: '#111827'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION: Photos */}
            <div style={{ marginTop: '16px' }}>
              <h3 
                className="font-semibold"
                style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '24px'
                }}
              >
                Photos
              </h3>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div 
                  className="grid gap-[16px]"
                  style={{
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    marginBottom: '16px'
                  }}
                >
                  {images.map((image, index) => (
                    <div 
                      key={index}
                      className="relative"
                      style={{
                        aspectRatio: '1',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #E5E7EB'
                      }}
                    >
                      <img 
                        src={image} 
                        alt={`Upload ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute flex items-center justify-center hover:opacity-80 transition-opacity"
                        style={{
                          top: '6px',
                          right: '6px',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={16} style={{ color: '#FFFFFF' }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              {images.length < 5 && (
                <label
                  className="flex flex-col items-center justify-center cursor-pointer transition-all"
                  style={{
                    padding: '48px 32px',
                    borderRadius: '12px',
                    border: '2px dashed #D1D5DB',
                    backgroundColor: '#F9FAFB',
                    transitionDuration: '150ms'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#F76902';
                    e.currentTarget.style.backgroundColor = '#FEF3EC';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#D1D5DB';
                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                  }}
                >
                  <div 
                    className="flex items-center justify-center"
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      marginBottom: '16px',
                      border: '1px solid #E5E7EB'
                    }}
                  >
                    <Upload size={28} style={{ color: '#6B7280' }} />
                  </div>
                  <span 
                    className="font-semibold"
                    style={{ fontSize: '15px', color: '#111827', marginBottom: '6px' }}
                  >
                    Upload photos (up to 5)
                  </span>
                  <span 
                    className="font-normal"
                    style={{ fontSize: '13px', color: '#9CA3AF' }}
                  >
                    {images.length === 0 ? 'PNG or JPG, up to 10MB each' : `${images.length} of 5 uploaded`}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              )}

              {/* All photos uploaded message */}
              {images.length === 5 && (
                <div
                  className="flex flex-col items-center justify-center"
                  style={{
                    padding: '24px',
                    borderRadius: '12px',
                    backgroundColor: '#F3F4F6'
                  }}
                >
                  <span 
                    className="font-medium"
                    style={{ fontSize: '14px', color: '#6B7280' }}
                  >
                    Maximum of 5 photos uploaded
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div 
              className="flex justify-end"
              style={{ marginTop: '16px', gap: '12px' }}
            >
              <button
                type="button"
                className="font-semibold transition-all"
                style={{
                  backgroundColor: 'transparent',
                  color: '#6B7280',
                  padding: '14px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  border: '1px solid #E5E7EB',
                  cursor: 'pointer',
                  transitionDuration: '200ms'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                  e.currentTarget.style.color = '#111827';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6B7280';
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="font-semibold transition-all"
                style={{
                  backgroundColor: '#F76902',
                  color: '#FFFFFF',
                  padding: '14px 32px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  transitionDuration: '200ms'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D55A02';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F76902';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Create Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}