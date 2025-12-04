// src/App.js
import React, { useState, useMemo, createContext, useContext } from "react";
import "./App.css";

/**
 * ---------- DATA MODELS (in-memory) ----------
 * User: { id, name, role, interests, followingCreatorIds, playlists: [{id,name,reelIds:[]}] }
 * Reel: { id, title, creatorId, durationSec, topic, concept, level, url, summary, quiz, comments, poll }
 * MicroCourse: { id, title, description, creatorId, reelIds, level, tags, progress: { [userId]: { completedReelIds: [] } } }
 */

const AppContext = createContext(null);

const initialUsers = [
  {
    id: "u1",
    name: "Learner Lisa",
    role: "learner",
    interests: ["DSA", "Python", "English"],
    followingCreatorIds: ["c1"],
    playlists: [
      {
        id: "p1",
        name: "DSA Basics",
        reelIds: ["r1"],
      },
    ],
  },
  {
    id: "c1",
    name: "Creator Carl",
    role: "creator",
    interests: ["Teaching", "DSA"],
    followingCreatorIds: [],
    playlists: [],
  },
];

const initialReels = [
  {
    id: "r1",
    title: "Binary Search in 60 seconds",
    creatorId: "c1",
    durationSec: 60,
    topic: "DSA",
    concept: "Binary Search",
    level: "Beginner",
    url: "", // could be any video URL; left empty for mock
    summary: "Binary search repeatedly halves the search space in a sorted array.",
    quiz: {
      question: "When can you apply binary search?",
      options: [
        "On any unsorted array",
        "Only on sorted arrays",
        "Only on linked lists",
        "Only on hash maps",
      ],
      correctIndex: 1,
    },
    comments: [
      { id: "cm1", userName: "Learner Lisa", text: "Super clear, thanks!" },
    ],
    poll: {
      question: "Was this reel enough to understand the concept?",
      options: ["Yes", "Almost", "No"],
      votes: [4, 2, 1],
    },
  },
  {
    id: "r2",
    title: "Time & Space Complexity Basics",
    creatorId: "c1",
    durationSec: 75,
    topic: "DSA",
    concept: "Complexity",
    level: "Beginner",
    url: "",
    summary: "Time complexity measures how running time grows with input size.",
    quiz: {
      question: "What does O(n) mean?",
      options: [
        "Time doubles every second",
        "Time grows roughly proportional to input size",
        "Constant time",
        "Logarithmic time",
      ],
      correctIndex: 1,
    },
    comments: [],
    poll: {
      question: "Do you want more examples on Big-O?",
      options: ["Yes", "No"],
      votes: [10, 0],
    },
  },
  {
    id: "r3",
    title: "Present Perfect Tense in 1 Minute",
    creatorId: "c1",
    durationSec: 60,
    topic: "English",
    concept: "Present Perfect",
    level: "Beginner",
    url: "",
    summary:
      "Present perfect is used for actions that happened in the past but are connected to now.",
    quiz: {
      question: "Which is correct?",
      options: [
        "I have ate breakfast.",
        "I have eaten breakfast.",
        "I eaten breakfast.",
        "I has eaten breakfast.",
      ],
      correctIndex: 1,
    },
    comments: [],
    poll: {
      question: "Is grammar content helpful?",
      options: ["Very", "Somewhat", "Not really"],
      votes: [5, 1, 0],
    },
  },
];

const initialCourses = [
  {
    id: "mc1",
    title: "DSA in 5 Minutes (Micro-Course)",
    description: "Core DSA concepts in just a few bite-sized reels.",
    creatorId: "c1",
    reelIds: ["r1", "r2"],
    level: "Beginner",
    tags: ["DSA", "placements"],
    progress: {
      u1: { completedReelIds: ["r1"] }, // Lisa completed reel r1 already
    },
  },
];

function AppProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);
  const [reels, setReels] = useState(initialReels);
  const [courses, setCourses] = useState(initialCourses);
  const [currentUserId, setCurrentUserId] = useState("u1"); // logged in as learner by default

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId]
  );

  // ---------- Helper update functions ----------
  const updateUser = (userId, updater) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updater(u) } : u))
    );
  };

  const updateCourse = (courseId, updater) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, ...updater(c) } : c))
    );
  };

  const value = {
    users,
    reels,
    courses,
    currentUser,
    setCurrentUserId,
    setReels,
    setCourses,
    updateUser,
    updateCourse,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

const useApp = () => useContext(AppContext);

// ---------- Components ----------

function App() {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <AppProvider>
      <div className="app-container">
        <Header />
        <nav className="nav-bar">
          <button
            className={activeTab === "feed" ? "active" : ""}
            onClick={() => setActiveTab("feed")}
          >
            Feed
          </button>
          <button
            className={activeTab === "courses" ? "active" : ""}
            onClick={() => setActiveTab("courses")}
          >
            Micro-Courses
          </button>
          <button
            className={activeTab === "playlists" ? "active" : ""}
            onClick={() => setActiveTab("playlists")}
          >
            Playlists
          </button>
          <button
            className={activeTab === "creator" ? "active" : ""}
            onClick={() => setActiveTab("creator")}
          >
            Creator Studio
          </button>
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </nav>

        <main className="main-content">
          {activeTab === "feed" && <Feed />}
          {activeTab === "courses" && <Courses />}
          {activeTab === "playlists" && <Playlists />}
          {activeTab === "creator" && <CreatorStudio />}
          {activeTab === "profile" && <Profile />}
        </main>
      </div>
    </AppProvider>
  );
}

function Header() {
  const { users, currentUser, setCurrentUserId } = useApp();

  return (
    <header className="header">
      <h1>ByteLearn</h1>
      <div className="user-switcher">
        <span>Logged in as: </span>
        <select
          value={currentUser?.id}
          onChange={(e) => setCurrentUserId(e.target.value)}
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.role})
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}

// -------------- FEED (Learner experience) -----------------

function Feed() {
  const { reels, currentUser, users } = useApp();
  const [selectedTab, setSelectedTab] = useState("forYou"); // forYou | following

  const creatorsById = useMemo(
    () =>
      users.reduce((map, u) => {
        map[u.id] = u;
        return map;
      }, {}),
    [users]
  );

  const personalizedReels = useMemo(() => {
    if (!currentUser) return [];

    // Simple "AI-like" scoring: based on interests + following
    return reels
      .map((r) => {
        let score = 0;
        if (currentUser.interests.includes(r.topic)) score += 2;
        if (currentUser.interests.includes(r.concept)) score += 1;
        if (currentUser.followingCreatorIds.includes(r.creatorId)) score += 3;
        return { reel: r, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((x) => x.reel);
  }, [reels, currentUser]);

  const followingReels = useMemo(() => {
    if (!currentUser) return [];
    return reels.filter((r) =>
      currentUser.followingCreatorIds.includes(r.creatorId)
    );
  }, [reels, currentUser]);

  const reelsToShow =
    selectedTab === "forYou" ? personalizedReels : followingReels;

  return (
    <div>
      <h2>Learning Feed</h2>
      <div className="feed-tabs">
        <button
          className={selectedTab === "forYou" ? "active" : ""}
          onClick={() => setSelectedTab("forYou")}
        >
          For You
        </button>
        <button
          className={selectedTab === "following" ? "active" : ""}
          onClick={() => setSelectedTab("following")}
        >
          Following
        </button>
      </div>
      {reelsToShow.length === 0 ? (
        <p>No reels found yet. Follow some creators or add interests.</p>
      ) : (
        <div className="reel-list">
          {reelsToShow.map((r) => (
            <ReelCard
              key={r.id}
              reel={r}
              creator={creatorsById[r.creatorId]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReelCard({ reel, creator }) {
  const { currentUser, updateUser, courses, updateCourse } = useApp();
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [localReel, setLocalReel] = useState(reel); // to handle comments & poll local

  const isFollowing =
    currentUser &&
    currentUser.followingCreatorIds.includes(reel.creatorId) &&
    currentUser.role === "learner";

  const handleFollow = () => {
    if (!currentUser || currentUser.role !== "learner") return;
    if (isFollowing) return;
    updateUser(currentUser.id, (u) => ({
      followingCreatorIds: [...u.followingCreatorIds, reel.creatorId],
    }));
  };

  const handleQuizSubmit = () => {
    if (selectedOptionIndex === null) return;
    const correct = selectedOptionIndex === reel.quiz.correctIndex;
    setQuizResult(correct ? "Correct 🎉" : "Try again 😅");
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: `cm-${Date.now()}`,
      userName: currentUser?.name || "Anonymous",
      text: commentText.trim(),
    };
    setLocalReel((prev) => ({
      ...prev,
      comments: [...prev.comments, newComment],
    }));
    setCommentText("");
  };

  const handlePollVote = (index) => {
    setLocalReel((prev) => {
      const newVotes = [...prev.poll.votes];
      newVotes[index] = (newVotes[index] || 0) + 1;
      return {
        ...prev,
        poll: { ...prev.poll, votes: newVotes },
      };
    });
  };

  const relatedCourses = courses.filter((c) => c.reelIds.includes(reel.id));

  const handleMarkCompleteInCourse = (courseId) => {
    if (!currentUser) return;
    updateCourse(courseId, (c) => {
      const userProgress = c.progress[currentUser.id] || {
        completedReelIds: [],
      };
      if (userProgress.completedReelIds.includes(reel.id)) return c;
      return {
        progress: {
          ...c.progress,
          [currentUser.id]: {
            completedReelIds: [...userProgress.completedReelIds, reel.id],
          },
        },
      };
    });
  };

  return (
    <div className="reel-card">
      <div className="reel-header">
        <div>
          <h3>{reel.title}</h3>
          <p className="reel-meta">
            {creator?.name} • {reel.topic} • {reel.level} • {reel.durationSec}s
          </p>
        </div>
        {currentUser?.role === "learner" && !isFollowing && (
          <button className="follow-btn" onClick={handleFollow}>
            Follow {creator?.name}
          </button>
        )}
      </div>

      {/* This would be a proper <video> with src in real app */}
      <div className="video-placeholder">
        <span>🎬 Reel preview (mock)</span>
      </div>

      <p className="summary">
        <strong>AI Summary: </strong>
        {reel.summary}
      </p>

      <div className="quiz-section">
        <p>
          <strong>Quick Quiz:</strong> {reel.quiz.question}
        </p>
        {reel.quiz.options.map((opt, idx) => (
          <label key={idx} className="quiz-option">
            <input
              type="radio"
              name={`quiz-${reel.id}`}
              checked={selectedOptionIndex === idx}
              onChange={() => {
                setSelectedOptionIndex(idx);
                setQuizResult(null);
              }}
            />
            {opt}
          </label>
        ))}
        <button className="small-btn" onClick={handleQuizSubmit}>
          Check Answer
        </button>
        {quizResult && <p className="quiz-result">{quizResult}</p>}
      </div>

      {relatedCourses.length > 0 && (
        <div className="course-links">
          <p>Part of micro-course(s):</p>
          {relatedCourses.map((c) => (
            <button
              key={c.id}
              className="small-btn"
              onClick={() => handleMarkCompleteInCourse(c.id)}
            >
              Mark complete in "{c.title}"
            </button>
          ))}
        </div>
      )}

      <Poll poll={localReel.poll} onVote={handlePollVote} />

      <div className="comments-section">
        <h4>Comments</h4>
        {localReel.comments.length === 0 && <p>No comments yet.</p>}
        {localReel.comments.map((c) => (
          <p key={c.id}>
            <strong>{c.userName}: </strong>
            {c.text}
          </p>
        ))}
        <div className="comment-input">
          <input
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button className="small-btn" onClick={handleAddComment}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

function Poll({ poll, onVote }) {
  const totalVotes = poll.votes.reduce((a, b) => a + b, 0) || 1;
  return (
    <div className="poll-section">
      <p>
        <strong>Poll:</strong> {poll.question}
      </p>
      {poll.options.map((opt, idx) => {
        const count = poll.votes[idx] || 0;
        const percent = Math.round((count / totalVotes) * 100);
        return (
          <button
            key={idx}
            className="poll-option"
            onClick={() => onVote(idx)}
          >
            {opt} — {percent}%
          </button>
        );
      })}
    </div>
  );
}

// -------------- MICRO-COURSES (Learner) -----------------

function Courses() {
  const { courses, reels, currentUser } = useApp();

  const getProgress = (course) => {
    if (!currentUser) return 0;
    const total = course.reelIds.length;
    const userProgress = course.progress[currentUser.id];
    if (!userProgress) return 0;
    const completed = userProgress.completedReelIds.length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div>
      <h2>Micro-Courses</h2>
      {courses.length === 0 ? (
        <p>No micro-courses yet.</p>
      ) : (
        <div className="course-list">
          {courses.map((c) => (
            <div key={c.id} className="course-card">
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <p>
                Level: {c.level} • Reels: {c.reelIds.length}
              </p>
              <p>Progress: {getProgress(c)}%</p>
              <h4>Reels in this course:</h4>
              <ul>
                {c.reelIds.map((rid) => {
                  const reel = reels.find((r) => r.id === rid);
                  return <li key={rid}>{reel?.title}</li>;
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -------------- PLAYLISTS (Learner) -----------------

function Playlists() {
  const { currentUser, reels, updateUser } = useApp();
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedReelId, setSelectedReelId] = useState("");

  if (!currentUser || currentUser.role !== "learner") {
    return <p>Switch to a learner account to manage playlists.</p>;
  }

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    const newPlaylist = {
      id: `pl-${Date.now()}`,
      name: newPlaylistName.trim(),
      reelIds: [],
    };
    updateUser(currentUser.id, (u) => ({
      playlists: [...u.playlists, newPlaylist],
    }));
    setNewPlaylistName("");
  };

  const handleAddReelToPlaylist = (playlistId) => {
    if (!selectedReelId) return;
    updateUser(currentUser.id, (u) => ({
      playlists: u.playlists.map((pl) =>
        pl.id === playlistId && !pl.reelIds.includes(selectedReelId)
          ? { ...pl, reelIds: [...pl.reelIds, selectedReelId] }
          : pl
      ),
    }));
  };

  return (
    <div>
      <h2>Learning Playlists</h2>
      <div className="playlist-create">
        <input
          placeholder="New playlist name"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
        />
        <button onClick={handleCreatePlaylist}>Create</button>
      </div>

      <div className="playlist-add">
        <select
          value={selectedReelId}
          onChange={(e) => setSelectedReelId(e.target.value)}
        >
          <option value="">Select a reel to add</option>
          {reels.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
      </div>

      {currentUser.playlists.length === 0 ? (
        <p>No playlists yet. Create one and start adding reels.</p>
      ) : (
        <div className="playlist-list">
          {currentUser.playlists.map((pl) => (
            <div key={pl.id} className="playlist-card">
              <h3>{pl.name}</h3>
              <button
                className="small-btn"
                onClick={() => handleAddReelToPlaylist(pl.id)}
              >
                Add selected reel
              </button>
              <ul>
                {pl.reelIds.map((rid) => {
                  const reel = reels.find((r) => r.id === rid);
                  return <li key={rid}>{reel?.title}</li>;
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// -------------- CREATOR STUDIO -----------------

function CreatorStudio() {
  const { currentUser } = useApp();

  if (!currentUser || currentUser.role !== "creator") {
    return <p>Switch to a creator account to use the Creator Studio.</p>;
  }

  return (
    <div>
      <h2>Creator Studio</h2>
      <UploadReelForm />
      <MicroCourseBuilder />
    </div>
  );
}

function UploadReelForm() {
  const { currentUser, setReels } = useApp();
  const [form, setForm] = useState({
    title: "",
    durationSec: 60,
    topic: "",
    concept: "",
    level: "Beginner",
    summary: "",
    quizQuestion: "",
    quizOptions: "",
    correctIndex: 0,
  });

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.topic.trim()) return;

    const options = form.quizOptions
      .split("\n")
      .map((o) => o.trim())
      .filter(Boolean);

    const newReel = {
      id: `r-${Date.now()}`,
      title: form.title.trim(),
      creatorId: currentUser.id,
      durationSec: Number(form.durationSec) || 60,
      topic: form.topic.trim(),
      concept: form.concept.trim(),
      level: form.level,
      url: "",
      summary: form.summary.trim() || "Short AI-style summary of this reel.",
      quiz: {
        question: form.quizQuestion.trim() || "Quick understanding check.",
        options: options.length ? options : ["Option A", "Option B"],
        correctIndex: Number(form.correctIndex) || 0,
      },
      comments: [],
      poll: {
        question: "Was this helpful?",
        options: ["Yes", "No"],
        votes: [0, 0],
      },
    };

    setReels((prev) => [newReel, ...prev]);
    setForm({
      title: "",
      durationSec: 60,
      topic: "",
      concept: "",
      level: "Beginner",
      summary: "",
      quizQuestion: "",
      quizOptions: "",
      correctIndex: 0,
    });
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Upload New Reel</h3>
      <label>
        Title
        <input
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
      </label>
      <label>
        Duration (seconds)
        <input
          type="number"
          value={form.durationSec}
          onChange={(e) => handleChange("durationSec", e.target.value)}
        />
      </label>
      <label>
        Topic (e.g., DSA, English)
        <input
          value={form.topic}
          onChange={(e) => handleChange("topic", e.target.value)}
          required
        />
      </label>
      <label>
        Concept (e.g., Binary Search)
        <input
          value={form.concept}
          onChange={(e) => handleChange("concept", e.target.value)}
        />
      </label>
      <label>
        Level
        <select
          value={form.level}
          onChange={(e) => handleChange("level", e.target.value)}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </label>
      <label>
        Summary (for AI-style text)
        <textarea
          value={form.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
        />
      </label>
      <h4>Quiz (optional)</h4>
      <label>
        Question
        <input
          value={form.quizQuestion}
          onChange={(e) => handleChange("quizQuestion", e.target.value)}
        />
      </label>
      <label>
        Options (one per line)
        <textarea
          value={form.quizOptions}
          onChange={(e) => handleChange("quizOptions", e.target.value)}
        />
      </label>
      <label>
        Correct Option Index (0-based)
        <input
          type="number"
          value={form.correctIndex}
          onChange={(e) => handleChange("correctIndex", e.target.value)}
        />
      </label>
      <button type="submit">Create Reel</button>
    </form>
  );
}

function MicroCourseBuilder() {
  const { reels, currentUser, courses, setCourses } = useApp();
  const [form, setForm] = useState({
    title: "",
    description: "",
    level: "Beginner",
    tags: "",
  });
  const [selectedReelIds, setSelectedReelIds] = useState([]);

  const myReels = reels.filter((r) => r.creatorId === currentUser.id);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const toggleReelSelection = (reelId) => {
    setSelectedReelIds((prev) =>
      prev.includes(reelId)
        ? prev.filter((id) => id !== reelId)
        : [...prev, reelId]
    );
  };

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!form.title.trim() || selectedReelIds.length === 0) return;
    const newCourse = {
      id: `mc-${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim(),
      creatorId: currentUser.id,
      reelIds: selectedReelIds,
      level: form.level,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      progress: {},
    };
    setCourses([...courses, newCourse]);
    setForm({ title: "", description: "", level: "Beginner", tags: "" });
    setSelectedReelIds([]);
  };

  return (
    <div className="card">
      <h3>Create Micro-Course</h3>
      <form onSubmit={handleCreateCourse}>
        <label>
          Title
          <input
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
        </label>
        <label>
          Description
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </label>
        <label>
          Level
          <select
            value={form.level}
            onChange={(e) => handleChange("level", e.target.value)}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>
        <label>
          Tags (comma separated)
          <input
            value={form.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
          />
        </label>
        <h4>Select Reels</h4>
        {myReels.length === 0 && <p>You have no reels yet. Create one first.</p>}
        <div className="reel-select-list">
          {myReels.map((r) => (
            <label key={r.id} className="reel-select-item">
              <input
                type="checkbox"
                checked={selectedReelIds.includes(r.id)}
                onChange={() => toggleReelSelection(r.id)}
              />
              {r.title} ({r.durationSec}s)
            </label>
          ))}
        </div>
        <button type="submit">Create Micro-Course</button>
      </form>
    </div>
  );
}

// -------------- PROFILE -----------------

function Profile() {
  const { currentUser, courses } = useApp();

  if (!currentUser) return null;

  const isLearner = currentUser.role === "learner";

  const totalCourses = courses.length;
  const completedCourses = isLearner
    ? courses.filter((c) => {
        const prog = c.progress[currentUser.id];
        return prog && prog.completedReelIds.length === c.reelIds.length;
      }).length
    : 0;

  return (
    <div>
      <h2>Profile</h2>
      <div className="card">
        <p>
          <strong>Name:</strong> {currentUser.name}
        </p>
        <p>
          <strong>Role:</strong> {currentUser.role}
        </p>
        {isLearner && (
          <>
            <p>
              <strong>Playlists:</strong> {currentUser.playlists.length}
            </p>
            <p>
              <strong>Micro-courses completed:</strong> {completedCourses} /{" "}
              {totalCourses}
            </p>
            <p>
              <strong>Interests:</strong> {currentUser.interests.join(", ")}
            </p>
          </>
        )}
        {!isLearner && (
          <>
            <p>
              <strong>Reel Creator:</strong> You can upload reels & create
              micro-courses from Creator Studio tab.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
