//rendering the skills chart 
function renderSkillChart(skills) {
    //searching DOM for the element with the id 'skills-chart' to render the chart
    const chartContainer = document.getElementById('skills-chart');
    if (!chartContainer) {
        console.error("Element with ID 'skills-chart' not found in the DOM.");
        return;
    } // Close the renderXPchart function

    if (!skills || skills.length === 0) {
      console.error("No skills data available to render the chart.");
      return;
    }

    //removing the previous chart if it exists
    chartContainer.innerHTML = ''; // Clear previous chart

    //the size of the chart
    const width = 800;
    const barHeight = 30;
    const spacing = 5;
    const labelWidth = 150;
    const scaleHeight = 30;
    const chartHeight = skills.length * (barHeight + spacing) + scaleHeight + 40;
    const maxSkill = 100;
    const offsetY = 40;

    //creating the svg element where the diagram will be drawn
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", chartHeight);

    skills.forEach((skill, index) => {
        const barWidth = (skill.amount / maxSkill) * (width - labelWidth); //the width of the bar
        const y = offsetY + index * (barHeight + spacing);
        const percentage = ((skill.amount / maxSkill) * 100).toFixed(1); //calculating the percentage

        //background rectagle
        const bgrect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bgrect.setAttribute("x", labelWidth);
        bgrect.setAttribute("y", y);
        bgrect.setAttribute("width", width - labelWidth);
        bgrect.setAttribute("height", barHeight);
        bgrect.setAttribute("fill", "rgb(154, 153, 153)");
        svg.appendChild(bgrect);

        //rectangle to show the percentage
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", labelWidth);
        rect.setAttribute("y", y);
        rect.setAttribute("width", barWidth);
        rect.setAttribute("height", barHeight);
        rect.setAttribute("fill", "rgb(103, 102, 102)");
        svg.appendChild(rect);

        const skillName = skill.type.replace('skill_', '').replace('-', ' ').replace(/\b\w/g, char => char.toUpperCase());

         // creating the title
         const skillsText = "Received skills"; 
         const skillsLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
         skillsLabel.setAttribute("x", 0); 
         skillsLabel.setAttribute("y", 30);
         skillsLabel.setAttribute("text-anchor", "start"); 
         skillsLabel.setAttribute("fill", "black"); 
         skillsLabel.setAttribute("class", "svg-title");
         skillsLabel.textContent = skillsText; 
         svg.appendChild(skillsLabel);
        
        //names of the skills
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", 0);
        label.setAttribute("y", y + barHeight / 2);
        label.setAttribute("dy", ".35em");
        label.setAttribute("fill", "#000");
        label.setAttribute("font-weight", "bold" )
        label.setAttribute("font-size", "16px");
        label.textContent = skill.type;
        label.textContent = `${skillName}`;
        svg.appendChild(label);

        //percentage of the skill
        const percentText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        percentText.setAttribute("x", labelWidth + barWidth - 5);
        percentText.setAttribute("y", y + barHeight / 2);
        percentText.setAttribute("dy", ".35em");
        percentText.setAttribute("fill", "#000"); 
        percentText.setAttribute("font-size", "13px");
        percentText.setAttribute("text-anchor", "end");
        percentText.textContent = `${percentage}%`;
        svg.appendChild(percentText);
    });

    const scaleY = chartHeight - 20;
    [0, 0.25, 0.5, 0.75, 1].forEach((val) => {
        const x = labelWidth + val * (width - labelWidth);
        const scaleText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        scaleText.setAttribute("x", x);
        scaleText.setAttribute("y", scaleY);
        scaleText.setAttribute("dy", "1em");
        scaleText.setAttribute("text-anchor", "middle");
        scaleText.setAttribute("fill", "#000");
        scaleText.textContent = `${val * 100}%`;
        svg.appendChild(scaleText);
    });
    chartContainer.appendChild(svg); 
}

//rendering the XP chart
function renderXPchart(xps){
    const width = 850;
    const height = 450;
    const margin = 80;

    //create svg element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    
    //ensuring that the xp data is valid and not empty
    if (!xps || xps.length === 0) {
        console.error("No XP data provided.");
        return;
    }

    const sortedXP = [...xps].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const points = [];
    let totalXP = 0;

    //creating the points for the graph
    sortedXP.forEach(item => {
        const createdAt = new Date(item.createdAt);
        if (isNaN(createdAt)) return;

        totalXP += item.amount;
        points.push({
            x: createdAt.getTime(), 
            y: totalXP,
            amount: item.amount,
            path: item.path //path of the project (fot the tooltip)
        });
    });

    if (points.length === 0) {
        console.error("No valid points to render the graph.");
        return;
    }

    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const maxY = Math.max(...points.map(p => p.y));

    const scaleX = x => {
        return margin + ((x - minX) / (maxX - minX)) * (width - 2 * margin);
    };
    const scaleY = y => height - margin - (y / maxY) * (height - 2 * margin);

    let pathD = "M ";
    pathD += points.map(p => `${scaleX(p.x)},${scaleY(p.y)}`).join(" L ");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathD);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "steelblue");
    path.setAttribute("stroke-width", 2);
    svg.appendChild(path);

    let tooltip = document.getElementById("xp-tooltip");
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "xp-tooltip";
        tooltip.style.position = "absolute";
        tooltip.style.background = "#333";
        tooltip.style.color = "#fff";
        tooltip.style.padding = "5px 10px";
        tooltip.style.borderRadius = "5px";
        tooltip.style.fontSize = "12px";
        tooltip.style.display = "none";
        tooltip.style.pointerEvents = "none";
        document.body.appendChild(tooltip);
    }

    points.forEach(p => {
        if (p.amount > 10000) {

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", scaleX(p.x));
        circle.setAttribute("cy", scaleY(p.y));
        circle.setAttribute("r", 4);
        circle.setAttribute("fill", "rgb(103, 102, 102)");


        circle.addEventListener("mouseover", e => {
            tooltip.style.display = "block";

            const projectName = p.path.split('/').pop(); 
            const xpAmount = p.amount; 

            tooltip.innerText = `Project: ${projectName} 
            XP: ${xpAmount}`;
            
        });

        circle.addEventListener("mousemove", e => {
            tooltip.style.left = e.pageX + 10 + "px";
            tooltip.style.top = e.pageY + 10 + "px";
        });

        circle.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        })

        svg.appendChild(circle);
        }
      });

      // Y-axis (XP on the left side)
    const yAxisSteps = 6;
    const stepSize = 100000;
    for (let i = 0; i <= yAxisSteps; i++) {
        const value = Math.round((maxY / yAxisSteps) * i / stepSize) * stepSize;
        const y = scaleY(value);

        // Line (tick)
        const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
        tick.setAttribute("x1", margin - 10);
        tick.setAttribute("y1", y);
        tick.setAttribute("x2", margin);
        tick.setAttribute("y2", y);
        tick.setAttribute("stroke", "#aaa");
        svg.appendChild(tick);

        // Text (scale for the XP)
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", margin - 5);
        label.setAttribute("y", y + 4);
        label.setAttribute("text-anchor", "end");
        label.setAttribute("font-size", "14");
        label.setAttribute("font-weight", "bold");
        label.setAttribute("font-family", "Arial");
        label.setAttribute("fill", "#333");
        label.textContent = value.toLocaleString(); //adding commas
        svg.appendChild(label);
        
        
        // creating the title
        const labelText = "XP Progress"; 
        const textLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textLabel.setAttribute("x", 0); 
        textLabel.setAttribute("y", 30); 
        textLabel.setAttribute("class", "xp-title")
        textLabel.setAttribute("text-anchor", "start");  
        textLabel.setAttribute("font-weight", "bold"); 
        textLabel.setAttribute("fill", "black"); 
        textLabel.textContent = labelText; 
        svg.appendChild(textLabel);


         // Y-line (left vertical line)
         const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
         yAxis.setAttribute("x1", margin);
         yAxis.setAttribute("y1", margin - 20);
         yAxis.setAttribute("x2", margin);
         yAxis.setAttribute("y2", height - margin);
         yAxis.setAttribute("stroke", "black");
         yAxis.setAttribute("stroke-width", 1.5);
         svg.appendChild(yAxis);
    }

        // X-axis (dates in the bottom)
        const xAxisSteps = 7; 
        const step = (maxX - minX) / xAxisSteps;
        const monthsSeen = new Set(); // to avoid duplicate month labels

    for (let i = 0; i <= xAxisSteps; i++) {
        const time = minX + step * i;
        const x = scaleX(time);
        const date = new Date(time);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

        
        // Line (tick)
        const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
        tick.setAttribute("x1", x);
        tick.setAttribute("y1", height - margin);
        tick.setAttribute("x2", x);
        tick.setAttribute("y2", height - margin + 5);
        tick.setAttribute("stroke", "#aaa");
        svg.appendChild(tick);
        
        // Text (date)
        if (!monthsSeen.has(monthKey)) {
            monthsSeen.add(monthKey);
            const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
            label.setAttribute("x", x);
            label.setAttribute("y", height - margin + 20);
            label.setAttribute("text-anchor", "middle");
            label.setAttribute("font-size", "14");
            label.setAttribute("font-weight", "bold");
            label.setAttribute("fill", "#333");
            label.textContent = new Date(time).toLocaleDateString('en', { month: 'short', year: '2-digit' });
            svg.appendChild(label);
    }
}

        // X-line (lower horizontal line)
        const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        xAxis.setAttribute("x1", margin);
        xAxis.setAttribute("y1", height - margin);
        xAxis.setAttribute("x2", width - margin);
        xAxis.setAttribute("y2", height - margin);
        xAxis.setAttribute("stroke", "black");
        xAxis.setAttribute("stroke-width", 1.5);
        svg.appendChild(xAxis);
        
        document.getElementById("xp-chart-container").appendChild(svg);
    } 
