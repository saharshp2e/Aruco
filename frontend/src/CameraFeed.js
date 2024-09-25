
// import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';

// const CameraFeed = () => {
//   const [detected, setDetected] = useState(false);
//   const [completed, setCompleted] = useState(false);
//   const [currentStep, setCurrentStep] = useState(0);  // Track the current step
//   const [isTutorialStarted, setIsTutorialStarted] = useState(false); // Track whether tutorial has started
//   const [isAudioPlaying, setIsAudioPlaying] = useState(false);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const audioRefs = useRef([
//     new Audio('/voice1.mp3'), // Step 1: Introduction to sulfate test
//     new Audio('/voice2.mp3'), // Step 2: Show distilled water
//     new Audio('/voice3.mp3'), // Step 3: Show test tube 1
//     new Audio('/voice4.mp3'),
//     new Audio('/voice5.mp3'),
//     new Audio('/voice6.mp3'),
//     new Audio('/voice7.mp3'),
//     new Audio('/voice8.mp3'),
//     new Audio('/voice9.mp3'),
//     new Audio('/voice10.mp3'),
//     new Audio('/voice11.mp3'),
//     new Audio('/voice12.mp3'),
//     new Audio('/voice13.mp3'), // Step 13: Test completion message
//   ]);

//   // Start camera feed and process frames only when the tutorial is started
//   useEffect(() => {
//     if (isTutorialStarted) {
//       const video = videoRef.current;

//       // Web camera initialization logic
//       navigator.mediaDevices.getUserMedia({ video: true })
//         .then((stream) => {
//           video.srcObject = stream;
//           video.onloadedmetadata = () => {
//             video.play();
//           };
//         })
//         .catch(err => console.error("Error accessing webcam:", err));

//       // Clean up: stop the camera stream when component unmounts
//       return () => {
//         if (video.srcObject) {
//           video.srcObject.getTracks().forEach(track => track.stop());
//         }
//       };
//     }
//   }, [isTutorialStarted]);  // Only run this effect when the tutorial starts

//   const processFrame = async () => {
//     if (!isTutorialStarted || completed) return;  // Stop processing if the tutorial hasn't started or test is complete
  
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');
    
//     // Ensure video is ready and draw the video feed onto the canvas
//     const video = videoRef.current;
//     if (video.readyState === video.HAVE_ENOUGH_DATA) {
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
//       // Send frame to backend for ArUco detection
//       canvas.toBlob(async (blob) => {
//         const formData = new FormData();
//         formData.append('image', blob, 'frame.jpg');
//         try {
//           const response = await axios.post('http://localhost:5000/detect', formData, { responseType: 'json' });
//           // console.log("Response from backend:", response.data);  // Log response
  
//           const { detected, augmented_image, ids, currentStep } = response.data;  // Destructure response
          
//           if (ids) {
//               handleMarkerDetection(ids, currentStep);
//             }

//           // Clear the canvas before drawing the new image
//           context.clearRect(0, 0, canvas.width, canvas.height);
  
//           // Display processed frame (augmented) coming from backend
//           const img = new Image();
//           img.src = `data:image/jpeg;base64,${augmented_image}`;
//           img.onload = () => {
//             context.drawImage(img, 0, 0, canvas.width, canvas.height);
//           };
//         } catch (err) {
//           console.error("Error processing frame:", err);
//         }
//       }, 'image/jpeg');
//     }
//   };



//   const handleMarkerDetection = (ids,currentStepFromBackend) => {
//     if (completed) return;
//     // console.log('inside handleMarkerDetection');
//      // Stop if completed


//         // For step 5, ensure both IDs 1 and 3 are present
//     if (currentStep === 5 && ids.includes(1) && ids.includes(3)) {
//       console.log('Step 5: Detected both Marker 1 and Marker 3');
//       setCurrentStep(currentStep + 1);
//       playNextAudio();
//       return;
//     }

//     if (currentStep === 6 && ids.includes(0) && ids.includes(1)) {
//       console.log('Step 6: Detected both Marker 0 and Marker 1');
//       setCurrentStep(currentStep + 1);
//       playNextAudio();
//       return;
//     }

//     // Step 7: Detect marker ID=1 with alternating y-axis conditions
//     if (currentStep === 7 && ids.includes(1) && !ids.includes(0)) {
//       console.log('Step 7: Marker 1 detected, alternating y-axis required');
//       // Assume the backend sends this information via the currentStepFromBackend
//       setCurrentStep(currentStep + 1);
//       playNextAudio();
//       return;
//     }

//     // Step 8: Detect marker ID=1 with alternating y-axis conditions
//     if (currentStep === 8 && ids.includes(1) && ids.includes(2)) {
//       console.log('Step 8: Detected both Marker 1 and Marker 2');
//       // Assume the backend sends this information via the currentStepFromBackend
//       setCurrentStep(currentStep + 1);
//       playNextAudio();
//       return;
//     }

//     // Step 9: Detect marker ID=1 and marker ID=3
//     if (currentStep === 9 && ids.includes(1) && ids.includes(3)) {
//       console.log('Step 9: Detected both Marker 1 and Marker 3');
//       // Assume the backend sends this information via the currentStepFromBackend
//       setCurrentStep(currentStep + 1);
//       playNextAudio();
//       return;
//     }

//     // Step 10: Detect marker ID=1 and marker ID=4
//     if (currentStep === 10 && ids.includes(1) && ids.includes(4)) {
//       console.log('Step 10: Detected both Marker 1 and Marker 4');
//       // Assume the backend sends this information via the currentStepFromBackend
//       setCurrentStep(currentStep + 1);
//       playNextAudio();
//       return;
//     }

//     const expectedMarkerId = currentStep; // Expect the next marker ID
//     // console.log('expectedMarkerId: '+expectedMarkerId+',currentSTep: '+currentStep)

//     if (ids.includes(expectedMarkerId)) {
//       console.log(`Step ${expectedMarkerId} verified with marker ID: ${expectedMarkerId}`);
//       setCurrentStep(currentStep + 1);
//       playNextAudio();
//     }
//   };

//   const playNextAudio = () => {
//     if (currentStep + 2 >= audioRefs.current.length) return; // Prevent out-of-bounds
    
    
//     const currentAudio = audioRefs.current[currentStep + 2];

    
//     setIsAudioPlaying(true); // Set audio playing to true
//     currentAudio.play().catch(err => console.error("Audio play error:", err));
    
//     currentAudio.onended = () => {
//       setIsAudioPlaying(false); // Set audio playing to false after it finishes
  
//       // Check if this is the last instructional step
//       if (currentStep === audioRefs.current.length - 2) {
//         setCompleted(true);
//         audioRefs.current[audioRefs.current.length - 1].play().catch(err => console.error("Audio play error:", err)); // Play completion audio
//       }
//     };
//   };
  
  

  
//   // Trigger the frame processing when the tutorial starts
//   useEffect(() => {
//     if (isTutorialStarted) {
//       const interval = setInterval(processFrame, 1000 / 10);  // 10 FPS
//       return () => clearInterval(interval);
//     }
//   }, [isTutorialStarted, currentStep]);


//   const startTutorial = () => {
//     setIsTutorialStarted(true);
//     audioRefs.current[0].play().catch(err => console.error("Audio play error:", err));
//     audioRefs.current[0].onended = () => {
//       audioRefs.current[1].play().catch(err => console.error("Audio play error:", err));
//     };
//     setCurrentStep(0);
//   };
  

//   return (
//     <div>
//       {!isTutorialStarted && (
//         <button onClick={startTutorial}>Start Tutorial</button>
//       )}
//       {isTutorialStarted && (
//         <div>
//           <video ref={videoRef} style={{ display: 'none' }} />
//           <canvas ref={canvasRef} width="640" height="480" style={{ border: '1px solid black' }} />
//           {completed && <p style={{ color: 'blue', marginTop: '10px' }}>Sulfate Ion Test Completed</p>}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CameraFeed;







import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const CameraFeed = () => {
  const [completed, setCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // Track the current step
  const [isTutorialStarted, setIsTutorialStarted] = useState(false); // Track whether tutorial has started
  const [isAudioPlaying, setIsAudioPlaying] = useState(false); // Track if audio is playing
  const [rollPhase, setRollPhase] = useState(0); // 0: looking for positive, 1: looking for negative, 2: looking for positive again
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const audioRefs = useRef([
    new Audio('/voice1.mp3'), // Step 1: Introduction to sulfate test
    new Audio('/voice2.mp3'), // Step 2: Show distilled water
    new Audio('/voice3.mp3'), // Step 3: Show test tube 1
    new Audio('/voice4.mp3'),
    new Audio('/voice5.mp3'),
    new Audio('/voice6.mp3'),
    new Audio('/voice7.mp3'),
    new Audio('/voice8.mp3'),
    new Audio('/voice9.mp3'),
    new Audio('/voice10.mp3'),
    new Audio('/voice11.mp3'),
    new Audio('/voice12.mp3'),
    // Add the rest of the steps here
    new Audio('/voice13.mp3'), // Step 13: Test completion message
  ]);

    // Paragraphs for each step
    const stepParagraphs = {
      '-1': 'आज हम सल्फेट आयनों की पहचान के लिए एक सरल रसायन परीक्षण करेंगे। पहले, हम यह सुनिश्चित कर लेते हैं कि हमारे पास सभी आवश्यक उपकरण तैयार हैं। डिस्टिल्ड वाटर का कंटेनर दिखाएँ।',
      0: 'टेस्ट ट्यूब 1 दिखाएँ।',
      1: 'हाइड्रोक्लोरिक एसिड का कंटेनर दिखाएँ।',
      2: 'बैरियम नाइट्रेट का कंटेनर दिखाएँ।',
      3: 'सल्फ्यूरिक एसिड का कंटेनर दिखाएँ।',
      4: 'अब हम सॉल्ट सोल्यूशन तैयार करेंगे। बैरियम नाइट्रेट सॉल्ट को टेस्ट ट्यूब 1 में डालें।',
      5: 'डिस्टिल्ड वाटर को टेस्ट ट्यूब 1 में डालें।',
      6: 'टेस्ट ट्यूब को जोर से हिलाएँ जब तक कि कम से कम आधा सॉल्ट घुल न जाए। कैमरे के सामने टेस्ट ट्यूब को साइडवेज़ में घुमाएँ ताकि इस स्टेप का पूरा होना संकेतित हो सके।',
      7: 'अब हम प्रारंभिक परीक्षण करेंगे। हाइड्रोक्लोरिक एसिड से यह सुनिश्चित होता है कि सोल्यूशन में कोई कार्बोनेट आयन या अन्य बाधक पदार्थ न हो। अगर कोई प्रतिक्रिया (बुलबुले या गैस) नहीं होती, तो सल्फेट परीक्षण करें। अब टेस्ट ट्यूब 1 में सोल्यूशन में डायलूट हाइड्रोक्लोरिक एसिड की कुछ बूंदें डालें।',
      8: 'अब हम सल्फेट परीक्षण करेंगे। टेस्ट ट्यूब 1 में सोल्यूशन में कुछ बूंदें बैरियम नाइट्रेट की डालें। अगर सफ़ेद प्रेसिपिटेट बनता है, तो इसका मतलब है कि सैंपल में सल्फेट आयन मौजूद हैं। बैरियम सल्फेट घुलनशील नहीं होता है और सल्फेट आयन की उपस्थिति में सफ़ेद प्रेसिपिटेट बनाता है।',
      9: 'अब हम पुष्टिकारी परीक्षण करेंगे। यह सुनिश्चित करने के लिए कि बना हुआ प्रेसिपिटेट बैरियम सल्फेट ही है, न कि कोई अन्य यौगिक। अगर कोई अतिरिक्त प्रेसिपिटेट नहीं बनता है, तो सल्फेट आयन की पुष्टि हो जाती है। अब टेस्ट ट्यूब 1 में, जो बैरियम सल्फेट का सोल्यूशन है, उसमें कुछ बूंदें सल्फ्यूरिक एसिड की डालें।',
      10: 'बधाई हो, सल्फेट आयन परीक्षण पूरा हुआ।'
    };

  // Start camera feed and process frames only when the tutorial is started
  useEffect(() => {
    if (isTutorialStarted) {
      const video = videoRef.current;

      // Web camera initialization logic
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
          };
        })
        .catch(err => console.error("Error accessing webcam:", err));

      // Clean up: stop the camera stream when component unmounts
      return () => {
        if (video.srcObject) {
          video.srcObject.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [isTutorialStarted]); // Only run this effect when the tutorial starts

  // const processFrame = async () => {
  //   if (!isTutorialStarted || completed || isAudioPlaying) return; // Stop processing if tutorial hasn't started, is completed, or audio is playing

  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext('2d');

  //   // Ensure video is ready and draw the video feed onto the canvas
  //   const video = videoRef.current;
  //   if (video.readyState === video.HAVE_ENOUGH_DATA) {
  //     context.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw live feed

  //     // Send frame to backend for ArUco detection
  //     canvas.toBlob(async (blob) => {
  //       const formData = new FormData();
  //       formData.append('image', blob, 'frame.jpg');
  //       try {
  //         const response = await axios.post('http://localhost:5000/detect', formData, { responseType: 'json' });
  //         // console.log("Response from backend:", response.data);  // Log response

  //         const { detected, augmented_image, ids, currentStep } = response.data; // Destructure response

  //         if (ids) {
  //           handleMarkerDetection(ids, currentStep);
  //         }

  //         // Clear the canvas before drawing the new image
  //         context.clearRect(0, 0, canvas.width, canvas.height);

  //         // Display processed frame (augmented) coming from backend
  //         const img = new Image();
  //         img.src = `data:image/jpeg;base64,${augmented_image}`;
  //         img.onload = () => {
  //           context.drawImage(img, 0, 0, canvas.width, canvas.height);
  //         };
  //       } catch (err) {
  //         console.error("Error processing frame:", err);
  //       }
  //     }, 'image/jpeg');
  //   }
  // };

  const processFrame = async () => {
    if (!isTutorialStarted || completed || isAudioPlaying) return;
  
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
  
    // Create an offscreen canvas for double buffering
    const offscreenCanvas = document.createElement('canvas');
    const offscreenContext = offscreenCanvas.getContext('2d');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
  
    // Ensure the video is ready and draw the video feed onto the offscreen canvas
    const video = videoRef.current;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      offscreenContext.drawImage(video, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
  
      // Send frame to backend for ArUco detection
      offscreenCanvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('image', blob, 'frame.jpg');
        try {
          const response = await axios.post('http://localhost:5000/detect', formData, { responseType: 'json' });
          const { detected, augmented_image, ids, currentStep, roll } = response.data;
  
          if (ids) {
            handleMarkerDetection(ids, roll);
          }
  
          // Load the augmented image (processed frame from backend)
          const img = new Image();
          img.src = `data:image/jpeg;base64,${augmented_image}`;
          img.onload = () => {
            // Draw the augmented image on the offscreen canvas
            offscreenContext.drawImage(img, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
  
            // Now copy the entire offscreen canvas to the visible canvas in one step
            context.clearRect(0, 0, canvas.width, canvas.height); // Clear the main canvas
            context.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
          };
        } catch (err) {
          console.error("Error processing frame:", err);
        }
      }, 'image/jpeg');
    }
  };

  useEffect(() => {
    console.log(`Current roll phase: ${rollPhase}`);
  }, [rollPhase]);


  const handleMarkerDetection = (ids, roll) => {
    if (completed) return;
    // Stop if completed

    const now = new Date().getTime();

    // For step 5, ensure both IDs 1 and 3 are present
    if (currentStep === 5 && ids.includes(1) && ids.includes(3)) {
      const roll1 = roll[1];
      const roll3 = roll[3];
      if (roll3 > 3 && roll1 < 10){
        console.log('Step 5: Detected both Marker 1 and Marker 3');
        setCurrentStep(currentStep + 1);
        playNextAudio();
        return;
      }
    }

    if (currentStep === 6 && ids.includes(0) && ids.includes(1)) {
      const roll0 = roll[0];
      const roll1 = roll[1];
      if (roll0 < 3 && roll1 < 3){
        console.log('Step 6: Detected both Marker 0 and Marker 1');
        setCurrentStep(currentStep + 1);
        playNextAudio();
        return;
      }
    }

    // Step 7: Detect marker ID=1 with alternating y-axis conditions
    if (currentStep === 7 && ids.includes(1) && !ids.includes(0)) {
      const roll1 = roll[1];
      let bool1= true
      let bool2= true
      if (roll1 > 3) {
        bool1 = false
        bool2 = false
      }
      else if (roll1 < 3) {
        bool2 = true
      }
      if (bool1 || bool2) {
        console.log('Step 7: Marker 1 detected, alternating y-axis required');
        // Assume the backend sends this information via the currentStepFromBackend
        setCurrentStep(currentStep + 1);
        playNextAudio();
        return;
      }

    }

    // // Step 7: Detect marker ID=1 with alternating y-axis conditions
    // if (currentStep === 7 && ids.includes(1) && !ids.includes(0)) {
    //   const roll1 = roll[1];  // Assuming roll[1] is the y-axis, adjust if necessary

    //   console.log(`roll1 value: ${roll1}`);  // Log the roll value to debug

    //   // Phase 0: Looking for the first positive value
    //   if (rollPhase === 0 && roll1 > 0) {
    //     console.log('Step 7: First positive detected');
    //     setRollPhase(1); // Transition to Phase 1
    //   }

    //   // Phase 1: Looking for the first negative value
    //   else if (rollPhase === 1 && roll1 < 0) {
    //     console.log('Step 7: First negative detected');
    //     setRollPhase(2); // Transition to Phase 2
    //   }

    //   // Phase 2: Looking for the second positive value
    //   else if (rollPhase === 2 && roll1 > 0) {
    //     console.log('Step 7: Second positive detected, alternating y-axis condition met');

    //     // Move to the next step and play audio
    //     setRollPhase(0);  // Reset the phase for future checks
    //     setCurrentStep(currentStep + 1);
    //     playNextAudio();
    //     return;
    //   }

    //   // Extra logging to debug phase changes
    //   else if (rollPhase === 0 && roll1 < 0) {
    //     console.log(`Negative value detected before first positive, roll1: ${roll1}`);
    //   }
    //   else if (rollPhase === 1 && roll1 >= 0) {
    //     console.log(`Still waiting for negative value, current roll1: ${roll1}`);
    //   }
    //   else if (rollPhase === 2 && roll1 <= 0) {
    //     console.log(`Still waiting for second positive value, current roll1: ${roll1}`);
    //   } 
    //   else {
    //     console.log(`Unexpected phase behavior, current phase: ${rollPhase}, roll1: ${roll1}`);
    //   }
    // }

    // Step 8: Detect marker ID=1 with alternating y-axis conditions
    if (currentStep === 8 && ids.includes(1) && ids.includes(2)) {
      const roll1 = roll[1];
      const roll2 = roll[2];
      if (roll1 < 3 && roll2 > 3) {
        console.log('Step 8: Detected both Marker 1 and Marker 2');
        // Assume the backend sends this information via the currentStepFromBackend
        setCurrentStep(currentStep + 1);
        playNextAudio();
        return;
      }
    }

    // Step 9: Detect marker ID=1 and marker ID=3
    if (currentStep === 9 && ids.includes(1) && ids.includes(3)) {
      const roll1 = roll[1];
      const roll3 = roll[3];
      if (roll1 > 3 && roll3 < 3) {
        console.log('Step 9: Detected both Marker 1 and Marker 3');
        // Assume the backend sends this information via the currentStepFromBackend
        setCurrentStep(currentStep + 1);
        playNextAudio();
        return;
      }

    }

    // Step 10: Detect marker ID=1 and marker ID=4
    if (currentStep === 10 && ids.includes(1) && ids.includes(4)) {
      const roll1 = roll[1];
      const roll4 = roll[4];
      if (roll1 < 3 && roll4 > 3) {
        console.log('Step 10: Detected both Marker 1 and Marker 4');
        // Assume the backend sends this information via the currentStepFromBackend
        setCurrentStep(currentStep + 1);
        playNextAudio();
        return;
      }
    }

    const expectedMarkerId = currentStep; // Expect the next marker ID

    if (ids.includes(expectedMarkerId)) {
      console.log(`Step ${expectedMarkerId} verified with marker ID: ${expectedMarkerId}`);
      setCurrentStep(currentStep + 1);
      playNextAudio();
    }
  };

  const playNextAudio = () => {
    if (currentStep + 2 >= audioRefs.current.length) return; // Prevent out-of-bounds

    const currentAudio = audioRefs.current[currentStep + 2];

    setIsAudioPlaying(true); // Set audio playing to true
    currentAudio.play().catch(err => console.error("Audio play error:", err));

    currentAudio.onended = () => {
      setIsAudioPlaying(false); // Set audio playing to false after it finishes

      // Check if this is the last instructional step
      if (currentStep === audioRefs.current.length - 2) {
        setCompleted(true);
        audioRefs.current[audioRefs.current.length - 1].play().catch(err => console.error("Audio play error:", err)); // Play completion audio
      }
    };
  };

  // Trigger the frame processing when the tutorial starts
  useEffect(() => {
    if (isTutorialStarted) {
      const interval = setInterval(processFrame, 1000 / 10); // 10 FPS
      return () => clearInterval(interval);
    }
  }, [isTutorialStarted, currentStep, isAudioPlaying]); // Added isAudioPlaying to the dependency array

  const startTutorial = () => {
    setIsTutorialStarted(true);
    audioRefs.current[0].play().catch(err => console.error("Audio play error:", err));
    audioRefs.current[0].onended = () => {
      audioRefs.current[1].play().catch(err => console.error("Audio play error:", err));
    };
    setCurrentStep(0);
  };

  return (
    <div>
      {!isTutorialStarted && (
        <button onClick={startTutorial}>Start Tutorial</button>
      )}
      {isTutorialStarted && (
        <div>
          <video ref={videoRef} style={{ display: 'none' }} />
          <canvas ref={canvasRef} width="640" height="480" style={{ border: '1px solid black' }} />
          <p style={{ marginTop: '10px' }}>
            {stepParagraphs[currentStep - 1] || 'Loading...'}
          </p>

          {/* Render check icon and "completed" text for each step */}
          {currentStep > 0 && (
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {Array.from({ length: currentStep }).map((_, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                  <span style={{ fontSize: '24px', color: 'green', marginRight: '10px' }}>✔</span>
                  <span style={{ fontSize: '16px', color: 'green' }}>Step {index + 1} completed</span>
                </div>
              ))}
            </div>
          )}
          {currentStep > 11 && <p style={{ color: 'blue', marginTop: '10px' }}>Sulfate Ion Test Completed</p>}
        </div>
      )}
    </div>
  );
};

export default CameraFeed;
