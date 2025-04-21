import React, { useState } from "react";

function ProjectsList() {
  const [loading, setLoading] = useState(false);
  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Goleaf News</h1>
    </div>
  );
}

export default ProjectsList;
