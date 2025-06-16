import React, { useState } from "react";
import { motion } from "framer-motion";

const MapEditorHelpBox = () => {
  const [showTutorial, setShowTutorial] = useState<boolean>(true);

  return (
    showTutorial && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute top-6 right-6 rounded-2xl shadow-lg border border-gray-700 p-4 w-[320px] z-50 custom-bg-1 text-white select-none"
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">🧭 Map Editor Tips</h2>
          <button
            className="text-sm text-gray-400 cursor-pointer hover:text-custom-border-highlight transition-all"
            onClick={() => setShowTutorial(false)}
          >
            ✕
          </button>
        </div>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>
            🔲 <strong>Hold Spacebar</strong> to move the map
          </li>
          <li>
            🔍 <strong>Ctrl + Scroll</strong> to zoom in and out
          </li>
          <li>
            🧩 <strong>Drag & Drop</strong> elements to place them on the grid
          </li>
        </ul>
      </motion.div>
    )
  );
};

export default MapEditorHelpBox;
