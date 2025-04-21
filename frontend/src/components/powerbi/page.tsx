// components/PowerBIEmbed.tsx
import React from 'react';

const PowerBIEmbed = () => {
  return (
    <div className="w-full h-screen">
      <iframe
        title="Power BI Dashboard"
        width="100%"
        height="100%"
        src="https://app.powerbi.com/groups/me/reports/078087f0-d545-428e-8d01-881e816c6c92/43ae30c72805060614d1?experience=power-bi"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default PowerBIEmbed;
