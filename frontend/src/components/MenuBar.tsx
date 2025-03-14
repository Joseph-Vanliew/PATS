import React from 'react';
import { FileMenu } from './FileMenu';
import { PetriNetDTO } from '../types';

interface MenuBarProps {
  petriNetData: PetriNetDTO;
  onImport: (data: PetriNetDTO) => void;
  highlightTitle?: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({ petriNetData, onImport, highlightTitle }) => {
  const handleSave = () => {
    // grabbing the title
    const dataToSave = {
      ...petriNetData,
      title: petriNetData.title || "Untitled Petri Net"
    };
    
    // Create a blob with the JSON data
    const jsonData = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Generate filename based on the title
    const sanitizedTitle = (petriNetData.title || "Untitled Petri Net")
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .toLowerCase();
      
    a.download = `${sanitizedTitle}.pats`;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // For a more user-friendly approach, we can also implement a "Save As" function
  // that uses the browser's built-in file save dialog
  const handleSaveAs = () => {
    // Check if the title is the default and prompt for editing if it is
    if (petriNetData.title === "Untitled Petri Net" && highlightTitle) {
      highlightTitle();
      return;
    }
    
    // Include the title in the data to be saved
    const dataToSave = {
      ...petriNetData,
      title: petriNetData.title || "Untitled Petri Net"
    };
    
    // Create a blob with the JSON data
    const jsonData = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Generate a suggested filename based on the title
    const sanitizedTitle = (petriNetData.title || "Untitled Petri Net")
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .toLowerCase();
      
    // showSaveFilePicker API
    if ('showSaveFilePicker' in window) {
      const saveFile = async () => {
        try {
          // @ts-ignore
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: `${sanitizedTitle}.pats`,
            types: [{
              description: 'Petri Net Files',
              accept: { 'application/json': ['.pats'] }
            }]
          });
          
          // @ts-ignore
          const writable = await fileHandle.createWritable();
          // @ts-ignore
          await writable.write(blob);
          // @ts-ignore
          await writable.close();
        } catch (err: unknown) {
          // if user cancels the save dialog
          console.log('Save canceled or failed:', err);
          
          // Fall back to the traditional method
          if (err instanceof Error && err.name !== 'AbortError') {
            handleSave();
          }
        }
      };
      
      saveFile();
    } else {
      // Falling back to the traditional method for browsers that don't support the File System Access API
      handleSave();
    }
  };

  return (
    <div className="menu-bar" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      padding: '6px 10px', 
      backgroundColor: '#252525', 
      borderBottom: '1px solid #333',
      height: '36px'
    }}>
      <FileMenu 
        petriNetData={petriNetData}
        onImport={onImport}
        onSaveAs={handleSaveAs}
        highlightTitle={highlightTitle}
      />
    </div>
  );
}; 