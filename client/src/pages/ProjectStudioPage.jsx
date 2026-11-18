import React from 'react';
import PageHeader from '../components/common/PageHeader';
import SmartProjectStudio from '../components/common/SmartProjectStudio';

const ProjectStudioPage = () => {
  return (
    <div>
      <PageHeader
        title="Smart Project Studio"
        subtitle="Select your industry niche, explore tailored page and feature recommendations, upload your reference designs, and get an instant engineering blueprint."
        breadcrumbText="Project Studio"
      />
      <div className="py-4">
        <SmartProjectStudio />
      </div>
    </div>
  );
};

export default ProjectStudioPage;