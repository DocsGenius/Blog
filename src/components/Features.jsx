export default function Features() {
  const features = [
    {
      title: 'DocsGenius is FREE!',
      description: 'Access to all articles is free for all users'
    },
    {
      title: 'Career Support!',
      description: 'Join our community of writers (and readers) to support each other on the journey to success!'
    },
    {
      title: 'Survive the Job Interview!',
      description: 'Real-world code examples and projects you can build and customize'
    },
    {
      title: 'Customizable Themes',
      description: 'Personalize your reading experience with our theme system'
    },
    {
      title: 'Owned by Writers, for Writers',
      description: 'Selling out is something DocsGenius will never do!'
    }
  ]

  return (
    <section id="about" className="features">
      <div className="section-header">
        <h2>The DocsGenius Mission</h2>
        <p>Supporting small writers and helping them grow their careers!</p>
      </div>
      
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
