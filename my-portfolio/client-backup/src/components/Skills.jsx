import React from 'react';

const Skills = ({ skills }) => {
  return (
    <section id="skills">
      <h2 className="section-title">Technical Expertise</h2>
      <p className="section-subtitle">Technologies and tools I work with</p>
      
      <div className="skills-container">
        {skills.map((category, index) => (
          <div key={index} className="skill-category">
            <h3>{category.category}</h3>
            <div className="skill-tags">
              {category.tags.map((tag, i) => (
                <span key={i} className="skill-tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;