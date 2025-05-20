import StoryCard from './StoryCard';

export default function StorySection() {
  const stories = [
    {
      username: 'akshay_kale',
      avatar: 'https://i.pravatar.cc/150?img=55 ',
      hasStory: true,
      isViewed: false,
    },
    {
      username: 'john_doe',
      avatar: 'https://i.pravatar.cc/150?img=11',
      hasStory: true,
      isViewed: true,
    },
    {
      username: 'neon_girl',
      avatar: 'https://i.pravatar.cc/150?img=45',
      hasStory: true,
      isViewed: false,
    },
    {
      username: 'hacker_zone',
      avatar: 'https://i.pravatar.cc/150?img=25',
      hasStory: false,
      isViewed: false,
    },
    {
      username: 'cyber_monk',
      avatar: 'https://i.pravatar.cc/150?img=36',
      hasStory: true,
      isViewed: false,
    },
    {
      username: 'nexus_dev',
      avatar: 'https://i.pravatar.cc/150?img=22',
      hasStory: false,
      isViewed: false,
    },
    {
      username: 'code_wizard',
      avatar: 'https://i.pravatar.cc/150?img=12',
      hasStory: true,
      isViewed: false,
    },
    {
      username: 'pixel_art',
      avatar: 'https://i.pravatar.cc/150?img=5',
      hasStory: true,
      isViewed: true,
    },
    {
      username: 'futurist',
      avatar: 'https://i.pravatar.cc/150?img=49',
      hasStory: true,
      isViewed: false,
    },
  ];

  return (
    <div className="w-full pt-4 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide py-2 px-1">
          {stories.map((story, index) => (
            <StoryCard key={index} story={story} />
          ))}
        </div>
      </div>
    </div>
  );
}
