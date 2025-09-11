import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaDownload, FaShare, FaEye, FaCalendar, FaMapMarkerAlt, FaNewspaper, FaCamera, FaVideo, FaTrophy } from 'react-icons/fa';

const MediaPage = () => {
  const [activeTab, setActiveTab] = useState('photos');
  const [selectedImage, setSelectedImage] = useState(null);

  // Media data
  const mediaData = {
    photos: [
      {
        id: 1,
        src: '/src/assets/CustomerStories/Dog.JPG',
        title: 'Rescued Dog with QR Collar',
        description: 'Happy dog safely returned to family using our QR-enabled collar',
        date: '2024-11-15',
        location: 'Indore, MP'
      },
      {
        id: 2,
        src: '/src/assets/CustomerStories/Cow.JPG',
        title: 'Cattle Safety Initiative',
        description: 'Large-scale cattle collar deployment for road safety',
        date: '2024-10-20',
        location: 'Rural Maharashtra'
      },
      {
        id: 3,
        src: '/src/assets/CustomerStories/dog2.JPG',
        title: 'Community Outreach Program',
        description: 'Distributing free collars to stray animals',
        date: '2024-09-10',
        location: 'Bhopal, MP'
      },
      {
        id: 4,
        src: '/src/assets/CustomerStories/dog3.JPG',
        title: 'Pet Safety Awareness',
        description: 'Educating pet owners about safety measures',
        date: '2024-08-25',
        location: 'Delhi NCR'
      },
      {
        id: 5,
        src: '/src/assets/hero-dog.JPG',
        title: 'Hero Dog Rescue',
        description: 'Successful rescue operation using our tracking technology',
        date: '2024-07-18',
        location: 'Mumbai, MH'
      },
      {
        id: 6,
        src: '/src/assets/sewing-woman.JPG',
        title: 'Women Empowerment',
        description: 'Local women involved in collar manufacturing',
        date: '2024-06-30',
        location: 'Indore, MP'
      }
    ],
    videos: [
      {
        id: 1,
        thumbnail: '/src/assets/CustomerStories/Dog.JPG',
        title: 'How QR Collars Save Lives',
        description: 'Documentary showing real rescue stories',
        duration: '5:32',
        views: '12.5K',
        url: '#'
      },
      {
        id: 2,
        thumbnail: '/src/assets/CustomerStories/Cow.JPG',
        title: 'Cattle Safety Initiative Launch',
        description: 'Coverage of our rural safety program',
        duration: '3:45',
        views: '8.2K',
        url: '#'
      },
      {
        id: 3,
        thumbnail: '/src/assets/hero-dog.JPG',
        title: 'Pet Owner Testimonials',
        description: 'Happy customers sharing their experiences',
        duration: '7:15',
        views: '15.8K',
        url: '#'
      }
    ],
    press: [
      {
        id: 1,
        logo: '/src/assets/collaborators/toi.webp',
        outlet: 'Times of India',
        title: 'Startup Uses QR Technology to Reduce Pet Loss by 90%',
        date: '2024-11-01',
        type: 'News Article',
        url: '#'
      },
      {
        id: 2,
        logo: '/src/assets/collaborators/betterindia.webp',
        outlet: 'The Better India',
        title: 'How This Indore Startup is Making Roads Safer for Animals',
        date: '2024-10-15',
        type: 'Feature Story',
        url: '#'
      },
      {
        id: 3,
        logo: '/src/assets/collaborators/peopleforanimal.webp',
        outlet: 'People for Animals',
        title: 'Revolutionary Pet Safety Technology Gains Recognition',
        date: '2024-09-20',
        type: 'Press Release',
        url: '#'
      }
    ],
    achievements: [
      {
        id: 1,
        title: 'Best Pet Tech Startup 2024',
        organization: 'India Pet Expo',
        date: '2024-11-10',
        description: 'Recognized for innovative QR collar technology'
      },
      {
        id: 2,
        title: 'Social Impact Award',
        organization: 'Startup India',
        date: '2024-08-15',
        description: 'For reducing animal-vehicle accidents by 85%'
      },
      {
        id: 3,
        title: '10,000+ Animals Protected',
        organization: 'Internal Milestone',
        date: '2024-07-01',
        description: 'Successfully protecting over 10,000 animals nationwide'
      }
    ]
  };

  const tabButtons = [
    { key: 'photos', label: 'Photos', icon: FaCamera },
    { key: 'videos', label: 'Videos', icon: FaVideo },
    { key: 'press', label: 'Press Coverage', icon: FaNewspaper },
    { key: 'achievements', label: 'Achievements', icon: FaTrophy }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="py-16 text-white bg-gradient-to-r from-yellow-600 to-orange-600"
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Pawsitivity Media Center
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-yellow-100 md:text-2xl">
              Discover our journey, impact stories, and media coverage in making roads safer for animals
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabButtons.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === key
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Photo Gallery</h2>
              <p className="text-lg text-gray-600">Capturing moments of impact and success stories from our mission</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mediaData.photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg"
                  onClick={() => setSelectedImage(photo)}
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="object-cover w-full h-64"
                  />
                  <div className="p-4">
                    <h3 className="mb-2 font-semibold text-gray-900">{photo.title}</h3>
                    <p className="mb-3 text-sm text-gray-600">{photo.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaCalendar />
                        {photo.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt />
                        {photo.location}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Video Gallery</h2>
              <p className="text-lg text-gray-600">Watch our impact stories and documentary coverage</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mediaData.videos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="object-cover w-full h-48"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                      <button className="p-4 transition-transform bg-white rounded-full hover:scale-110">
                        <FaPlay className="ml-1 text-xl text-yellow-600" />
                      </button>
                    </div>
                    <div className="absolute px-2 py-1 text-xs text-white bg-black rounded bottom-2 right-2 bg-opacity-70">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 font-semibold text-gray-900">{video.title}</h3>
                    <p className="mb-3 text-sm text-gray-600">{video.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaEye />
                        {video.views} views
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Press Coverage Tab */}
        {activeTab === 'press' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Press Coverage</h2>
              <p className="text-lg text-gray-600">Media recognition and coverage of our mission</p>
            </div>
            
            <div className="space-y-6">
              {mediaData.press.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={item.logo}
                      alt={item.outlet}
                      className="object-contain w-16 h-16 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full">
                          {item.type}
                        </span>
                        <span className="text-sm text-gray-500">{item.date}</span>
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">{item.title}</h3>
                      <p className="mb-3 text-gray-600">Published by {item.outlet}</p>
                      <button className="flex items-center gap-1 text-sm font-medium text-yellow-600 hover:text-yellow-700">
                        Read Article <FaShare className="text-xs" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Achievements & Milestones</h2>
              <p className="text-lg text-gray-600">Recognition and milestones in our journey</p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mediaData.achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 border border-yellow-200 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50"
                >
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-yellow-500 rounded-full">
                      <FaTrophy className="text-2xl text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">{achievement.title}</h3>
                    <p className="mb-3 font-medium text-yellow-700">{achievement.organization}</p>
                    <p className="mb-3 text-sm text-gray-600">{achievement.description}</p>
                    <span className="text-xs text-gray-500">{achievement.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="max-w-4xl max-h-full overflow-auto bg-white rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-auto"
            />
            <div className="p-6">
              <h3 className="mb-2 text-2xl font-bold text-gray-900">{selectedImage.title}</h3>
              <p className="mb-4 text-gray-600">{selectedImage.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FaCalendar />
                    {selectedImage.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt />
                    {selectedImage.location}
                  </span>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-yellow-500 rounded-lg hover:bg-yellow-600">
                  <FaDownload />
                  Download
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MediaPage;
