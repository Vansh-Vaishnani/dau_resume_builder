import { useState, useRef } from "react";
import { FiFileText, FiDownload, FiUpload, FiHelpCircle } from "react-icons/fi";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import "./App.css";
import dauLogo from "./resume/dau.jpg";

function App() {
  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "First",
    lastName: "Last",
    degree: "B.Tech – Computer Science and Engineering",
    email: "firstlast@dau.ac.in",
    linkedin: "linkedin.com/in/firstlast",
    github: "github.com/firstlast"
  });

  // Education State
  const [education, setEducation] = useState([
    {
      id: 1,
      institution: "Dhirubhai Ambani University",
      duration: "20XX - Present",
      score: "CPI: 7.51",
      location: "Gandhinagar, Gujarat"
    },
    {
      id: 2,
      institution: "12th School Name (GHSEB)",
      duration: "20XX - Present",
      score: "Percentage: ",
      location: "Gandhinagar, Gujarat"
    },
    {
      id: 3,
      institution: "10th School Name (GSEB)",
      duration: "20XX - Present",
      score: "Percentage: ",
      location: "Gandhinagar, Gujarat"
    }
  ]);

  // Experience State
  const [experience, setExperience] = useState([
    {
      id: 1,
      organization: "Company Name",
      location: "City, Country",
      position: "Position Title",
      duration: "Month Year - Present",
      responsibilities: ["Responsibility description here"]
    }
  ]);

  // Projects State
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Project Name",
      technologies: "Technology Stack",
      github: "https://github.com/username/repo",
      points: ["Project description point 1", "Project description point 2"]
    }
  ]);

  // Skills State
  const [skills, setSkills] = useState([
    { id: 1, category: "Languages", items: "C++, Python, JavaScript" },
    { id: 2, category: "Technologies", items: "React, Node.js, MongoDB" }
  ]);

  // Position of Responsibility State
  const [por, setPor] = useState([
    {
      id: 1,
      position: "Vice President",
      duration: "April 2023 - Present",
      organization: "Association of Exploration Geophysicists",
      responsibilities: ["Led student initiatives and coordinated industry-academic events to promote geophysics awareness and collaboration."]
    }
  ]);

  // Achievements State
  const [achievements, setAchievements] = useState(["Achievement description here"]);

  // File input ref for import
  const fileInputRef = useRef(null);
  
  // Help modal state
  const [showHelp, setShowHelp] = useState(false);

  // Helper to escape LaTeX special characters
  const escapeLatex = (text) => {
    if (!text) return '';
    // Use safe placeholders without special characters
    let result = text
      // First, protect existing \\ (line breaks)
      .replace(/\\\\/g, 'XLINEBREAKX')
      // Convert Markdown bold to LaTeX
      .replace(/\*\*([^*]+)\*\*/g, 'XBOLDSTARTX$1XBOLDENDX')
      // Convert Markdown italic to LaTeX (single asterisk, not part of bold)
      .replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, 'XITALICSTARTX$1XITALICENDX')
      // Now escape special LaTeX characters
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/\$/g, '\\$')
      .replace(/#/g, '\\#')
      .replace(/_/g, '\\_')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}')
      // Now replace placeholders with LaTeX commands
      .replace(/XBOLDSTARTX/g, '\\textbf{')
      .replace(/XBOLDENDX/g, '}')
      .replace(/XITALICSTARTX/g, '\\textit{')
      .replace(/XITALICENDX/g, '}')
      .replace(/XLINEBREAKX/g, '\\\\');  // Restore line breaks
    
    return result;
  };

  // Helper to unescape LaTeX special characters (for importing)
  // Convert LaTeX formatting to Markdown for easier editing
  const unescapeLatex = (text) => {
    if (!text) return '';
    return text
      .replace(/\\textbackslash\{\}/g, '\\')
      .replace(/\\&/g, '&')
      .replace(/\\%/g, '%')
      .replace(/\\\$/g, '$')
      .replace(/\\#/g, '#')
      .replace(/\\_/g, '_')
      .replace(/\\textasciitilde\{\}/g, '~')
      .replace(/\\textasciicircum\{\}/g, '^')
      // Convert LaTeX formatting to Markdown - handle both closed and unclosed braces
      .replace(/\\textbf\{([^}]+)\}/g, '**$1**')   // \textbf{text} → **text**
      .replace(/\\textbf\{([^}]*)/g, '**$1**')     // \textbf{text (unclosed) → **text**
      .replace(/\\textit\{([^}]+)\}/g, '*$1*')     // \textit{text} → *text*
      .replace(/\\textit\{([^}]*)/g, '*$1*')       // \textit{text (unclosed) → *text*
      .replace(/\\emph\{([^}]+)\}/g, '*$1*')       // \emph{text} → *text*
      .replace(/\\emph\{([^}]*)/g, '*$1*')         // \emph{text (unclosed) → *text*
      .replace(/\\\\\s*/g, '\\\\')                  // Keep \\ as is for line breaks
      .trim();
  };

  // Generate heading.tex content
  const generateHeading = () => {
    // Extract clean usernames from URLs for display
    const linkedinUsername = personalInfo.linkedin.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '');
    const githubUsername = personalInfo.github.replace(/^(https?:\/\/)?github\.com\//, '').replace(/\/$/, '');
    
    return ` %----------HEADING----------%
\\begin{tabularx}{\\textwidth}{@{} X r @{}}
    \\begin{minipage}[t]{\\linewidth}
        \\textbf{\\Huge \\scshape ${escapeLatex(personalInfo.firstName)} ${escapeLatex(personalInfo.lastName)}} \\\\[0.5em]
        \\textit{${escapeLatex(personalInfo.degree)}} \\\\[0.5em]
        \\small % Smaller font for contact info to fit in one line
        \\href{mailto:${personalInfo.email}}{\\seticon{faEnvelope} \\underline{${personalInfo.email}}} \\quad
        \\href{https://www.${personalInfo.linkedin}}{\\seticon{faLinkedin} \\underline{${linkedinUsername}}} \\quad
        \\href{https://${personalInfo.github}}{\\seticon{faGithub} \\underline{${githubUsername}}}
    \\end{minipage} & 
    \\raisebox{-0.5\\height}{\\includegraphics[height=3.2cm]{dau.jpg}}
\\end{tabularx}

`;
  };

  // Generate education.tex content
  const generateEducation = () => {
    return `%-----------EDUCATION-----------%
\\section{\\large{Education}}
    \\resumeSubHeadingListStart
   
${education.map(edu => `    \\resumeSubheading
    {${escapeLatex(edu.institution)}}{${escapeLatex(edu.duration)}}
    {\\textbf{${escapeLatex(edu.score)}}}{${escapeLatex(edu.location)}}`).join('\n')}
    
    \\resumeSubHeadingListEnd
`;
  };

  // Generate experience.tex content
  const generateExperience = () => {
    return `%-----------EXPERIENCE-----------%
\\section{Experience}
\\resumeSubHeadingListStart

${experience.map(exp => `    \\resumeSubheading
    {${escapeLatex(exp.organization)}}{${escapeLatex(exp.location)}}
    {${escapeLatex(exp.position)}}{${escapeLatex(exp.duration)}}
    \\resumeItemListStart
${exp.responsibilities.map(resp => `        \\resumeItem{${escapeLatex(resp)}}`).join('\n')}
    \\resumeItemListEnd
`).join('\n')}
\\resumeSubHeadingListEnd
`;
  };

  // Generate projects.tex content
  const generateProjects = () => {
    return `%-----------PROJECTS-----------%
\\section{Projects}
\\resumeSubHeadingListStart

${projects.map(proj => `    \\resumeProjectHeading
    {\\textbf{${escapeLatex(proj.name)}} $|$ \\emph{${escapeLatex(proj.technologies)}}}%
    {\\href{${proj.github}}{\\faGithub}}
    \\resumeItemListStart
${proj.points.map(point => `        \\resumeItem{${escapeLatex(point)}}`).join('\n')}
    \\resumeItemListEnd
`).join('\n')}
\\resumeSubHeadingListEnd
`;
  };

  // Generate skills.tex content
  const generateSkills = () => {
    return `%-----------TECHNICAL SKILLS-----------%
\\section{Technical Skills}

${skills.map(skill => `\\listOfSkills{${escapeLatex(skill.category)}}{${escapeLatex(skill.items)}}`).join('\n')}
`;
  };

  // Generate por.tex content
  const generatePor = () => {
    return `  %-----------Social Engagements -----------%
\\section{Position Of Responsibility}

\\resumeSubHeadingListStart

${por.map(p => `    \\resumeSubheading
    {${escapeLatex(p.position)}}{${escapeLatex(p.duration)}}{${escapeLatex(p.organization)}}{}{}
    
    \\resumeItemListStart
${p.responsibilities.map(resp => `        \\resumeItem{${escapeLatex(resp)}}`).join('\n')}
       
    \\resumeItemListEnd
`).join('\n')}    
\\vspace{-1em}
`;
  };

  // Generate achievements.tex content
  const generateAchievements = () => {
    return `\\section{\\hspace{-1em}Achievements}
\\vspace{-0.5em}
\\resumeItemListStart
${achievements.map(achievement => `    \\resumeItem{${escapeLatex(achievement)}}`).join('\n')}
\\resumeItemListEnd
`;
  };

  // Generate custom-commands.tex content
  const generateCustomCommands = () => {
    return ` %-------------------------%
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{1pt}\\item 
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\ 
      \\textit{\\small#3} & \\textit{\\small #4} \\\\ 
    \\end{tabular*}\\vspace{-10pt}
}

\\newcommand{\\listOfSkills}[2]{
    \\vspace{0.1em}
    \\hspace{1em}
    \\small
    \\textbf{#1}: {#2}
    \\\\
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-10pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\vspace{4pt}
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-10pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}

\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}

\\newcommand{\\resumeItemListStart}{\\vspace{4pt}\\begin{itemize}}

\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-7pt}}

\\definecolor{Black}{RGB}{0, 0, 0}
\\newcommand{\\seticon}[1]{\\textcolor{Black}{\\csname #1\\endcsname}}
`;
  };

  // Generate main resume.tex content
  const generateMainTex = () => {
    return ` %-------------------------
% Resume in Latex
% Author : Audric Serador
% Inspired by: https://github.com/sb2nov/resume
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{fontawesome5}
\\usepackage{hyperref}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{graphicx}
\\usepackage{mwe}
\\usepackage{wrapfig}

\\input{glyphtounicode}

% Custom font
\\usepackage[default]{lato}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

 \\usepackage{geometry}
\\geometry{left=1.2cm, top=0.5cm, right=1.2cm, bottom=0.5cm}


\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
    \\vspace{-2pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-6pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------%
% Custom commands
\\begin{document}
\\include{custom-commands}

%-------------------------------------------%
%%%%%%  RESUME STARTS HERE  %%%%%

%----------HEADING----------%
\\input{src/heading}

%-----------EDUCATION-----------%
\\input{src/education}

%-----------EXPERIENCE-----------%
\\input{src/experience}

%-----------PROJECTS-----------%
\\input{src/projects}

%-----------SKILLS-----------%
\\input{src/skills}

${por.length > 0 && por.some(p => p.position || p.organization) ? `%-----------PostionOfResponisibilities-----------%
\\input{src/por}
` : ''}
${achievements.length > 0 && achievements.some(a => a.trim()) ? `%-----------ACHIEVEMENTS-----------%
\\input{src/achievements}
` : ''}
%-------------------------------------------%
\\end{document}
`;
  };

  // ========== IMPORT FUNCTIONALITY ==========
  
  // Parser functions to extract data from LaTeX files
  const parseHeading = (content) => {
    console.log("=== PARSING HEADING ===");
    console.log("Content length:", content.length);
    console.log("First 300 chars:", content.substring(0, 300));
    try {
      // Extract first name and last name - more flexible pattern
      const nameMatch = content.match(/\\scshape\s+([A-Za-z]+)\s+([A-Za-z]+)/);
      console.log("Name match:", nameMatch);
      
      // Extract degree - anything in \textit{...}
      const degreeMatch = content.match(/\\textit\{([^}]+)\}/);
      console.log("Degree match:", degreeMatch);
      
      // Extract email - look for mailto: or @
      const emailMatch = content.match(/(?:mailto:)?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      console.log("Email match:", emailMatch);
      
      // Extract LinkedIn - flexible pattern for linkedin.com
      const linkedinMatch = content.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([^}\s"]+)/);
      console.log("LinkedIn match:", linkedinMatch);
      
      // Extract GitHub - flexible pattern for github.com
      const githubMatch = content.match(/(?:https?:\/\/)?github\.com\/([^}\s"]+)/);
      console.log("GitHub match:", githubMatch);
      
      if (nameMatch) {
        const newData = {
          firstName: unescapeLatex(nameMatch[1] || ""),
          lastName: unescapeLatex(nameMatch[2] || ""),
          degree: unescapeLatex(degreeMatch ? degreeMatch[1] : ""),
          email: emailMatch ? emailMatch[1] : "",
          linkedin: linkedinMatch ? `linkedin.com/in/${linkedinMatch[1]}` : "",
          github: githubMatch ? `github.com/${githubMatch[1]}` : ""
        };
        console.log("Setting personal info to:", newData);
        setPersonalInfo(prev => ({
          ...prev,
          ...newData
        }));
        console.log("Personal info updated!");
      } else {
        console.log("No name match found - not updating personal info");
      }
    } catch (error) {
      console.error("Error parsing heading:", error);
    }
  };

  const parseEducation = (content) => {
    console.log("=== PARSING EDUCATION ===");
    console.log("Content length:", content.length);
    console.log("First 500 chars:", content.substring(0, 500));
    try {
      const entries = [];
      // Match all resumeSubheading blocks - flexible to capture score with or without \textbf
      // The third group can contain anything (including nested braces)
      const regex = /\\resumeSubheading\s*\{([^}]+)\}\{([^}]+)\}\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}\{([^}]+)\}/g;
      let match;
      let matchCount = 0;
      
      while ((match = regex.exec(content)) !== null) {
        matchCount++;
        console.log(`Match ${matchCount}:`, {
          institution: match[1],
          duration: match[2],
          score: match[3],
          location: match[4]
        });
        
        entries.push({
          id: Date.now() + Math.random(),
          institution: unescapeLatex(match[1].trim()),
          duration: unescapeLatex(match[2].trim()),
          score: unescapeLatex(match[3].trim()),
          location: unescapeLatex(match[4].trim())
        });
      }
      
      console.log("Total education entries found:", entries.length);
      if (entries.length > 0) {
        console.log("Setting education to:", entries);
        setEducation(entries);
      } else {
        console.log("No education entries found - regex didn't match");
        console.log("Trying simpler pattern...");
        
        // Fallback: try to find any \resumeSubheading
        const simpleMatches = content.match(/\\resumeSubheading/g);
        console.log("Found", simpleMatches?.length || 0, "resumeSubheading occurrences");
      }
    } catch (error) {
      console.error("Error parsing education:", error);
    }
  };

  const parseExperience = (content) => {
    try {
      const entries = [];
      const sections = content.split('\\resumeSubheading').slice(1);
      
      sections.forEach(section => {
        const headerMatch = section.match(/\{([^}]+)\}\{([^}]+)\}\s*\{([^}]+)\}\{([^}]+)\}/);
        if (headerMatch) {
          const responsibilities = [];
          const itemRegex = /\\resumeItem\{([^}]+)\}/g;
          let itemMatch;
          
          while ((itemMatch = itemRegex.exec(section)) !== null) {
            responsibilities.push(unescapeLatex(itemMatch[1].trim()));
          }
          
          entries.push({
            id: Date.now() + Math.random(),
            organization: unescapeLatex(headerMatch[1].trim()),
            location: unescapeLatex(headerMatch[2].trim()),
            position: unescapeLatex(headerMatch[3].trim()),
            duration: unescapeLatex(headerMatch[4].trim()),
            responsibilities: responsibilities.length > 0 ? responsibilities : [""]
          });
        }
      });
      
      if (entries.length > 0) {
        setExperience(entries);
      }
    } catch (error) {
      console.error("Error parsing experience:", error);
    }
  };

  const parseProjects = (content) => {
    try {
      const entries = [];
      const sections = content.split('\\resumeProjectHeading').slice(1);
      
      sections.forEach(section => {
        const titleMatch = section.match(/\\textbf\{([^}]+)\}/);
        const techMatch = section.match(/\\emph\{([^}]+)\}/);
        const githubMatch = section.match(/\\href\{([^}]+)\}/);
        
        const points = [];
        const itemRegex = /\\resumeItem\{([^}]+)\}/g;
        let itemMatch;
        
        while ((itemMatch = itemRegex.exec(section)) !== null) {
          points.push(unescapeLatex(itemMatch[1].trim()));
        }
        
        if (titleMatch) {
          entries.push({
            id: Date.now() + Math.random(),
            name: unescapeLatex(titleMatch[1].trim()),
            technologies: unescapeLatex(techMatch ? techMatch[1].trim() : ""),
            github: githubMatch ? githubMatch[1].trim() : "",
            points: points.length > 0 ? points : [""]
          });
        }
      });
      
      if (entries.length > 0) {
        setProjects(entries);
      }
    } catch (error) {
      console.error("Error parsing projects:", error);
    }
  };

  const parseSkills = (content) => {
    try {
      const entries = [];
      const regex = /\\listOfSkills\{([^}]+)\}\{([^}]+)\}/g;
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        entries.push({
          id: Date.now() + Math.random(),
          category: unescapeLatex(match[1].trim()),
          items: unescapeLatex(match[2].trim())
        });
      }
      
      if (entries.length > 0) {
        setSkills(entries);
      }
    } catch (error) {
      console.error("Error parsing skills:", error);
    }
  };

  const parsePor = (content) => {
    try {
      const entries = [];
      const sections = content.split('\\resumeSubheading').slice(1);
      
      sections.forEach(section => {
        const headerMatch = section.match(/\{([^}]+)\}\{([^}]+)\}\s*\{([^}]+)\}/);
        if (headerMatch) {
          const responsibilities = [];
          const itemRegex = /\\resumeItem\{([^}]+)\}/g;
          let itemMatch;
          
          while ((itemMatch = itemRegex.exec(section)) !== null) {
            responsibilities.push(unescapeLatex(itemMatch[1].trim()));
          }
          
          entries.push({
            id: Date.now() + Math.random(),
            position: unescapeLatex(headerMatch[1].trim()),
            organization: unescapeLatex(headerMatch[2].trim()),
            duration: unescapeLatex(headerMatch[3].trim()),
            responsibilities: responsibilities.length > 0 ? responsibilities : [""]
          });
        }
      });
      
      if (entries.length > 0) {
        setPor(entries);
      }
    } catch (error) {
      console.error("Error parsing POR:", error);
    }
  };

  const parseAchievements = (content) => {
    try {
      const entries = [];
      const regex = /\\resumeItem\{([^}]+)\}/g;
      let match;
      
      while ((match = regex.exec(content)) !== null) {
        entries.push(unescapeLatex(match[1].trim()));
      }
      
      if (entries.length > 0) {
        setAchievements(entries);
      }
    } catch (error) {
      console.error("Error parsing achievements:", error);
    }
  };

  // Main import function
  const importResume = async (file) => {
    console.log("\n\n========== STARTING IMPORT ==========");
    console.log("File name:", file.name);
    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      console.log("ZIP loaded successfully");
      const allFiles = Object.keys(contents.files);
      console.log("Files in ZIP:", allFiles);
      
      // Find the base path (could be root or in a folder)
      const headingFile = allFiles.find(f => f.endsWith('src/heading.tex'));
      const basePath = headingFile ? headingFile.replace('src/heading.tex', '') : '';
      console.log("Detected base path:", basePath || "(root)");
      
      // Helper function to get file
      const getFile = async (path) => {
        const fullPath = basePath + path;
        if (contents.files[fullPath]) {
          return await contents.files[fullPath].async('string');
        }
        return null;
      };
      
      // Parse each file if it exists
      const headingContent = await getFile('src/heading.tex');
      if (headingContent) {
        console.log("\n--- Processing heading.tex ---");
        parseHeading(headingContent);
      } else {
        console.log("No heading.tex found");
      }
      
      const eduContent = await getFile('src/education.tex');
      if (eduContent) {
        console.log("\n--- Processing education.tex ---");
        parseEducation(eduContent);
      }
      
      const expContent = await getFile('src/experience.tex');
      if (expContent) {
        console.log("\n--- Processing experience.tex ---");
        parseExperience(expContent);
      }
      
      const projContent = await getFile('src/projects.tex');
      if (projContent) {
        console.log("\n--- Processing projects.tex ---");
        parseProjects(projContent);
      }
      
      const skillsContent = await getFile('src/skills.tex');
      if (skillsContent) {
        console.log("\n--- Processing skills.tex ---");
        parseSkills(skillsContent);
      }
      
      const porContent = await getFile('src/por.tex');
      if (porContent) {
        console.log("\n--- Processing por.tex ---");
        parsePor(porContent);
      }
      
      const achContent = await getFile('src/achievements.tex');
      if (achContent) {
        console.log("\n--- Processing achievements.tex ---");
        parseAchievements(achContent);
      }
      
      console.log("\n========== IMPORT COMPLETE ==========\n");
      alert('Resume imported successfully! Form has been populated with your data.');
    } catch (error) {
      console.error('Error importing resume:', error);
      alert('Error importing resume. Please make sure the ZIP file has the correct structure.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.zip')) {
      importResume(file);
    } else {
      alert('Please select a valid .zip file');
    }
  };

  // ========== END IMPORT FUNCTIONALITY ==========

  // Download ZIP with all files
  const downloadZip = async () => {
    const zip = new JSZip();
    
    // Add all tex files
    zip.file("resume.tex", generateMainTex());
    zip.file("custom-commands.tex", generateCustomCommands());
    
    // Create src folder and add section files
    const srcFolder = zip.folder("src");
    srcFolder.file("heading.tex", generateHeading());
    srcFolder.file("education.tex", generateEducation());
    srcFolder.file("experience.tex", generateExperience());
    srcFolder.file("projects.tex", generateProjects());
    srcFolder.file("skills.tex", generateSkills());
    srcFolder.file("por.tex", generatePor());
    srcFolder.file("achievements.tex", generateAchievements());
    
    // Add dau.jpg logo
    try {
      const response = await fetch(dauLogo);
      const blob = await response.blob();
      zip.file("dau.jpg", blob);
    } catch (error) {
      console.error("Error loading DAU logo:", error);
    }
    
    // Generate ZIP and download
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "DAU_Resume_" + personalInfo.firstName + "_" + personalInfo.lastName + ".zip");
    });
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <img src={dauLogo} alt="DAU Logo" className="dau-logo" />
          <div className="header-content">
            <h1>DAU Resume Builder</h1>
            <p>Made only for Dhirubhai Ambani University Students</p>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowHelp(true)} className="btn-help">
            <FiHelpCircle /> <span>Help</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="btn-import">
            <FiUpload /> <span>Import LaTeX ZIP</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button onClick={downloadZip} className="btn-download">
            <FiDownload /> <span>Download LaTeX ZIP</span>
          </button>
        </div>
      </header>

      <div className="container">
        <div className="form-panel">
          {/* Personal Info */}
          <section className="section">
            <h2>Personal Information</h2>
            <div className="row">
              <div className="field">
                <label>First Name</label>
                <input
                  type="text"
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                />
              </div>
              <div className="field">
                <label>Last Name</label>
                <input
                  type="text"
                  value={personalInfo.lastName}
                  onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                />
              </div>
            </div>
            <div className="field">
              <label>Degree & Program</label>
              <input
                type="text"
                value={personalInfo.degree}
                onChange={(e) => setPersonalInfo({...personalInfo, degree: e.target.value})}
              />
            </div>
            <div className="field">
              <label>DAU Email</label>
              <input
                type="email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
              />
            </div>
            <div className="field">
              <label>LinkedIn (without https://www.)</label>
              <input
                type="text"
                value={personalInfo.linkedin}
                onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})}
              />
            </div>
            <div className="field">
              <label>GitHub (without https://)</label>
              <input
                type="text"
                value={personalInfo.github}
                onChange={(e) => setPersonalInfo({...personalInfo, github: e.target.value})}
              />
            </div>
          </section>

          {/* Education */}
          <section className="section">
            <h2>Education</h2>
            {education.map((edu, index) => (
              <div key={edu.id} className="card">
                <h4>Education {index + 1}</h4>
                <div className="row">
                  <div className="field">
                    <label>Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEdu = [...education];
                        newEdu[index].institution = e.target.value;
                        setEducation(newEdu);
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Duration</label>
                    <input
                      type="text"
                      value={edu.duration}
                      onChange={(e) => {
                        const newEdu = [...education];
                        newEdu[index].duration = e.target.value;
                        setEducation(newEdu);
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="field">
                    <label>Score</label>
                    <input
                      type="text"
                      value={edu.score}
                      onChange={(e) => {
                        const newEdu = [...education];
                        newEdu[index].score = e.target.value;
                        setEducation(newEdu);
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Location</label>
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => {
                        const newEdu = [...education];
                        newEdu[index].location = e.target.value;
                        setEducation(newEdu);
                      }}
                    />
                  </div>
                </div>
                {education.length > 1 && (
                  <button
                    className="btn-remove"
                    onClick={() => setEducation(education.filter((_, i) => i !== index))}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              className="btn-add"
              onClick={() => setEducation([...education, {
                id: Date.now(),
                institution: "",
                duration: "",
                score: "",
                location: ""
              }])}
            >
              + Add Education
            </button>
          </section>

          {/* Experience */}
          <section className="section">
            <h2>Experience</h2>
            {experience.map((exp, index) => (
              <div key={exp.id} className="card">
                <h4>Experience {index + 1}</h4>
                <div className="row">
                  <div className="field">
                    <label>Organization</label>
                    <input
                      type="text"
                      value={exp.organization}
                      onChange={(e) => {
                        const newExp = [...experience];
                        newExp[index].organization = e.target.value;
                        setExperience(newExp);
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => {
                        const newExp = [...experience];
                        newExp[index].location = e.target.value;
                        setExperience(newExp);
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="field">
                    <label>Position</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => {
                        const newExp = [...experience];
                        newExp[index].position = e.target.value;
                        setExperience(newExp);
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Duration</label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => {
                        const newExp = [...experience];
                        newExp[index].duration = e.target.value;
                        setExperience(newExp);
                      }}
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Responsibilities (one per line)</label>
                  <textarea
                    rows="4"
                    value={exp.responsibilities.join('\n')}
                    onChange={(e) => {
                      const newExp = [...experience];
                      newExp[index].responsibilities = e.target.value.split('\n').filter(r => r.trim());
                      setExperience(newExp);
                    }}
                  />
                </div>
                <button
                  className="btn-remove"
                  onClick={() => setExperience(experience.filter((_, i) => i !== index))}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="btn-add"
              onClick={() => setExperience([...experience, {
                id: Date.now(),
                organization: "",
                location: "",
                position: "",
                duration: "",
                responsibilities: [""]
              }])}
            >
              + Add Experience
            </button>
          </section>

          {/* Projects */}
          <section className="section">
            <h2>Projects</h2>
            {projects.map((proj, index) => (
              <div key={proj.id} className="card">
                <h4>Project {index + 1}</h4>
                <div className="field">
                  <label>Project Name</label>
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => {
                      const newProj = [...projects];
                      newProj[index].name = e.target.value;
                      setProjects(newProj);
                    }}
                  />
                </div>
                <div className="field">
                  <label>Technologies Used</label>
                  <input
                    type="text"
                    value={proj.technologies}
                    onChange={(e) => {
                      const newProj = [...projects];
                      newProj[index].technologies = e.target.value;
                      setProjects(newProj);
                    }}
                  />
                </div>
                <div className="field">
                  <label>GitHub URL</label>
                  <input
                    type="text"
                    value={proj.github}
                    onChange={(e) => {
                      const newProj = [...projects];
                      newProj[index].github = e.target.value;
                      setProjects(newProj);
                    }}
                  />
                </div>
                <div className="field">
                  <label>Project Description Points (one per line)</label>
                  <textarea
                    rows="4"
                    value={proj.points.join('\n')}
                    onChange={(e) => {
                      const newProj = [...projects];
                      newProj[index].points = e.target.value.split('\n').filter(p => p.trim());
                      setProjects(newProj);
                    }}
                  />
                </div>
                <button
                  className="btn-remove"
                  onClick={() => setProjects(projects.filter((_, i) => i !== index))}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="btn-add"
              onClick={() => setProjects([...projects, {
                id: Date.now(),
                name: "",
                technologies: "",
                github: "",
                points: [""]
              }])}
            >
              + Add Project
            </button>
          </section>

          {/* Skills */}
          <section className="section">
            <h2>Technical Skills</h2>
            {skills.map((skill, index) => (
              <div key={skill.id} className="skill-row">
                <div className="field">
                  <label>Category</label>
                  <input
                    type="text"
                    value={skill.category}
                    onChange={(e) => {
                      const newSkills = [...skills];
                      newSkills[index].category = e.target.value;
                      setSkills(newSkills);
                    }}
                  />
                </div>
                <div className="field" style={{flex: 2}}>
                  <label>Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={skill.items}
                    onChange={(e) => {
                      const newSkills = [...skills];
                      newSkills[index].items = e.target.value;
                      setSkills(newSkills);
                    }}
                  />
                </div>
                <button
                  className="btn-icon"
                  onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              className="btn-add"
              onClick={() => setSkills([...skills, {
                id: Date.now(),
                category: "",
                items: ""
              }])}
            >
              + Add Skill Category
            </button>
          </section>

          {/* Position of Responsibility */}
          <section className="section">
            <h2>Position of Responsibility</h2>
            {por.map((p, index) => (
              <div key={p.id} className="card">
                <h4>Position {index + 1}</h4>
                <div className="row">
                  <div className="field">
                    <label>Position Title</label>
                    <input
                      type="text"
                      value={p.position}
                      onChange={(e) => {
                        const newPor = [...por];
                        newPor[index].position = e.target.value;
                        setPor(newPor);
                      }}
                    />
                  </div>
                  <div className="field">
                    <label>Duration</label>
                    <input
                      type="text"
                      value={p.duration}
                      onChange={(e) => {
                        const newPor = [...por];
                        newPor[index].duration = e.target.value;
                        setPor(newPor);
                      }}
                    />
                  </div>
                </div>
                <div className="field">
                  <label>Organization</label>
                  <input
                    type="text"
                    value={p.organization}
                    onChange={(e) => {
                      const newPor = [...por];
                      newPor[index].organization = e.target.value;
                      setPor(newPor);
                    }}
                  />
                </div>
                <div className="field">
                  <label>Responsibilities (one per line)</label>
                  <textarea
                    rows="3"
                    value={p.responsibilities.join('\n')}
                    onChange={(e) => {
                      const newPor = [...por];
                      newPor[index].responsibilities = e.target.value.split('\n').filter(r => r.trim());
                      setPor(newPor);
                    }}
                  />
                </div>
                <button
                  className="btn-remove"
                  onClick={() => setPor(por.filter((_, i) => i !== index))}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              className="btn-add"
              onClick={() => setPor([...por, {
                id: Date.now(),
                position: "",
                duration: "",
                organization: "",
                responsibilities: [""]
              }])}
            >
              + Add Position
            </button>
          </section>

          {/* Achievements */}
          <section className="section">
            <h2>Achievements</h2>
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-row">
                <textarea
                  rows="2"
                  value={achievement}
                  onChange={(e) => {
                    const newAchievements = [...achievements];
                    newAchievements[index] = e.target.value;
                    setAchievements(newAchievements);
                  }}
                />
                <button
                  className="btn-icon"
                  onClick={() => setAchievements(achievements.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              className="btn-add"
              onClick={() => setAchievements([...achievements, ""])}
            >
              + Add Achievement
            </button>
          </section>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📚 How to Use DAU Resume Builder</h2>
              <button className="modal-close" onClick={() => setShowHelp(false)}>×</button>
            </div>
            <div className="modal-body">
              <section className="help-section">
                <h3>✨ Text Formatting</h3>
                <p>Use these shortcuts in any text field:</p>
                <table className="help-table">
                  <tbody>
                    <tr>
                      <td><code>**bold text**</code></td>
                      <td>→ Makes text <strong>bold</strong></td>
                    </tr>
                    <tr>
                      <td><code>*italic text*</code></td>
                      <td>→ Makes text <em>italic</em></td>
                    </tr>
                    <tr>
                      <td><code>\\</code></td>
                      <td>→ Line break (new line in same section)</td>
                    </tr>
                  </tbody>
                </table>
                <p className="help-example">
                  <strong>Example:</strong><br />
                  <code>Secured **AIR 1,234** in national exam\\Solved **500+** problems on competitive platforms</code><br />
                  <small>Will create bold text with a line break between sentences</small>
                </p>
              </section>

              <section className="help-section">
                <h3>📤 How to Use with Overleaf</h3>
                <ol className="help-steps">
                  <li>Fill out the form and click <strong>"Download LaTeX ZIP Package"</strong></li>
                  <li>Go to <a href="https://www.overleaf.com" target="_blank" rel="noopener noreferrer">Overleaf.com</a> and login/signup</li>
                  <li>Click <strong>"New Project"</strong> → <strong>"Upload Project"</strong></li>
                  <li>Select the downloaded ZIP file</li>
                  <li>Overleaf will open your resume - click <strong>"Recompile"</strong> to generate PDF</li>
                  <li>Download PDF from Overleaf or make further edits there</li>
                </ol>
              </section>

              <section className="help-section">
                <h3>🔄 Import Existing Resume</h3>
                <p>Click <strong>"Import Resume"</strong> and select your previously downloaded ZIP file. The form will auto-fill with your data for easy editing!</p>
              </section>

              <section className="help-section">
                <h3>💡 Tips</h3>
                <ul className="help-tips">
                  <li>Use special characters like &, %, $ normally - they're handled automatically</li>
                  <li>Empty sections (like Positions of Responsibility) won't appear in final resume if not filled</li>
                  <li>Keep descriptions concise - recruiters spend 6 seconds per resume!</li>
                  <li>Use action verbs: "Developed", "Implemented", "Managed"</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
