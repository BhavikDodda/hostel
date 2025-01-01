
# 🏠 My Roomify  

My Roomify is an interactive web application that implements the **Top Trading Cycle (TTC)** algorithm to optimize room allocations based on user preferences. Initially designed to address the challenges of hostel room swaps at SVNIT, this project has evolved into a powerful tool for solving similar allocation problems efficiently.  

## 🚀 Live Demo  
Try it out here: [My Roomify](https://my-roomify.vercel.app/)  

## 🎥 Demo Video  
[Watch the demo](https://youtu.be/mcmyfdFp2SA)  

## 📋 Features  
- Input the number of rooms/participants.  
- Specify initial room allocations and members' preference lists.  
- Use TTC to compute optimal reallocations.  
- Visualize intermediate envy-graphs and cycles.  
- See before-and-after improvements in room assignments.  

## 🧠 How It Works  
The TTC algorithm solves the problem of matching participants to their preferred rooms by:  
1. Collecting participants' preferences and initial allocations.  
2. Iteratively removing cycles in envy-graphs to reallocate rooms.  
3. Producing a **Pareto optimal**, **truthful**, and **core-selected** solution.  

## 📈 Algorithm Properties  
- **Truthfulness**: Participants have no incentive to lie about their preferences.  
- **Pareto Optimality**: Ensures that no reallocation can make one participant better off without making another worse off.  
- **Participation**: Guarantees participants receive at least as good an outcome as opting out.  
- **Core Selection**: Ensures no subset of participants can create a better reallocation among themselves.  


## 📊 Visualizations  
My Roomify features **interactive envy-graphs** that allow users to:  
- View envy relationships at each step.  
- Hover over nodes to inspect details.  
- Understand how cycles are eliminated and rooms are reassigned.  

## 🌟 Applications  
Beyond hostel room allocation, this project can be applied to:  
- Course registrations.  
- Resource assignments in organizations.  
- Any scenario with n participants and n items, each with preferences.  

## 🛠 Tech Stack  
- **Frontend**: Next.js, React, D3.js for interactive graphs.  
- **Backend**: Flask for API and TTC algorithm implementation.  

## 🖋 Acknowledgments  
- TTC algorithm learnt during the **ACM Summer School on Algorithmic Game Theory** at IMSc.  
- Featured in **IMSc's Outreach Newsletter**: [Read here](https://www.imsc.res.in/outreach/scicomm/2024/july/events/acm-agt/).
- Credits to [Kahaan](https://github.com/Kahaan19) and [Tanvi](https://github.com/TANVII05) for the website logo.

# Development

This is a hybrid Next.js + Python app that uses Next.js as the frontend and Flask as the API backend. One great use case of this is to write Next.js apps that use Python AI libraries on the backend.

## Getting Started Locally

First, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Run the backend flask server with

```bash
python api/index.py
```

The Flask server will be running on [http://127.0.0.1:5328](http://127.0.0.1:5328) – feel free to change the port in `package.json` (you'll also need to update it in `next.config.js`).

## 🤝 Contributions  
Contributions, issues, and feature requests are welcome!  
1. Fork the repository.  
2. Create a new branch (`git checkout -b feature-branch`).  
3. Commit your changes (`git commit -m "Added feature XYZ"`).  
4. Push to the branch (`git push origin feature-branch`).  
5. Open a pull request.  

## 📧 Contact  
If you have any ideas or suggestions, feel free to:  
- Leave a comment.  
- Open a GitHub issue.  

---

Thank you for checking out My Roomify! Let’s make room allocations efficient and fair for everyone! 😊
