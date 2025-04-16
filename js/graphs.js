function renderSkillChart(skills) {
    const chartContainer = document.getElementById('skills-chart');
    console.log("Chart container:", chartContainer);
    if (!chartContainer) {
        console.error("Element with ID 'skills-chart' not found in the DOM.");
        return;
    }

    console.log("Skills data:", skills);
    if (!skills || skills.length === 0) {
      console.error("No skills data available to render the chart.");
      return;
    }

    chartContainer.innerHTML = ''; // Clear previous chart

    const width = 800;
    const barHeight = 30;
    const spacing = 5;
    const labelWidth = 150;
    const scaleHeight = 30;
    const chartHeight = skills.length * (barHeight + spacing) + scaleHeight;
    const maxSkill = 100;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", chartHeight);

    skills.forEach((skill, index) => {
        const barWidth = (skill.amount / maxSkill) * (width - labelWidth); //the width of the bar
        const y = index * (barHeight + spacing);
        const percentage = ((skill.amount / maxSkill) * 100).toFixed(1);

        //background rectagle
        const bgrect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bgrect.setAttribute("x", labelWidth);
        bgrect.setAttribute("y", y);
        bgrect.setAttribute("width", width - labelWidth);
        bgrect.setAttribute("height", barHeight);
        bgrect.setAttribute("fill", "rgb(154, 153, 153)");
        svg.appendChild(bgrect);

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", labelWidth);
        rect.setAttribute("y", y);
        rect.setAttribute("width", barWidth);
        rect.setAttribute("height", barHeight);
        rect.setAttribute("fill", "rgb(103, 102, 102)");
        svg.appendChild(rect);

        const skillName = skill.type.replace('skill_', '').replace('-', ' ').replace(/\b\w/g, char => char.toUpperCase());

        //skills name
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

        //percentage
        const percentText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        percentText.setAttribute("x", labelWidth + barWidth - 5);
        percentText.setAttribute("y", y + barHeight / 2);
        percentText.setAttribute("dy", ".35em");
        percentText.setAttribute("fill", "#000"); 
        percentText.setAttribute("font-size", "12px");
        percentText.setAttribute("text-anchor", "end");
        percentText.textContent = `${percentage}%`;
        svg.appendChild(percentText);
    });

    const scaleY = skills.length * (barHeight + spacing) + 10;
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
    console.log("SVG element created:", svg);
    console.log("Chart container after rendering:", chartContainer);    
}

function renderXPchart(xps){
    const width = 800;
    const height = 400;
    const margin = 40;

    //create svg element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.style.border = "1px solid #ccc";

    const validXP = xps.filter(item => item.createdAt);
    console.log("Valid XP data:", validXP);

    const sortedXP = [...xps].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    console.log("Sorted XP data:", sortedXP);

    const points = [];
    let totalXP = 0;
    
    sortedXP.forEach((item) => {
        if (!item.createdAt) {
            console.error("No createdAt date found:", item);
            return;
        }
        const time = new Date(item.createdAt).getTime();
        totalXP += item.amount;
        points.push({
            x: time,
            y: totalXP,
            amount: item.amount,
            path: item.path
            });
        });

        console.log("Points for the graph:", points);

    if (points.length === 0) {
        console.error("No valid points to render the graph.");
        return;
    }

    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const maxY = Math.max(...points.map(p => p.y));

    console.log("minX:", minX, "maxX:", maxX, "maxY:", maxY);

    const scaleX = x => {
        return margin + ((x - minX) / (maxX - minX)) * (width - 2 * margin);
    };
    const scaleY = y => height - margin - (y / maxY) * (height - 2 * margin);

    let pathD = "M ";
    pathD += points.map(p => `${scaleX(p.x)},${scaleY(p.y)}`).join(" L ");
    console.log("Path data:", pathD);

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
            tooltip.innerText = p.path.split('/').pop();
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

    document.getElementById("xp-chart-container").appendChild(svg);
}