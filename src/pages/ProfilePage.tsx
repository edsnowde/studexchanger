
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Post as PostType } from "@/utils/types";
import Navbar from "@/components/Navbar";
import Profile from "@/components/Profile";

// Sample data - in a real app, this would come from an API
const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    department: "Computer Science",
    year: "4th",
    role: "senior",
    bio: "Senior CS student passionate about web development and mentoring.",
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    department: "Computer Science",
    year: "2nd",
    role: "junior",
    bio: "Sophomore interested in machine learning and algorithms.",
    createdAt: new Date("2023-02-20"),
  },
];

const samplePosts: PostType[] = [
  {
    id: "1",
    content: "Just finished my internship at Google! Feel free to reach out if you need any tips for applying to tech companies. #Internship #TechJobs",
    images: ["https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"],
    createdAt: new Date("2023-08-10T14:30:00"),
    updatedAt: new Date("2023-08-10T14:30:00"),
    authorId: "1",
    author: sampleUsers[0],
    likes: ["2"],
    comments: [],
    tags: ["#Internship", "#TechJobs"],
  },
  {
    id: "2",
    content: "Can any seniors recommend good electives for second-year Computer Science students? Looking for something challenging but interesting. #StudyTips #CourseSelection",
    createdAt: new Date("2023-08-09T10:15:00"),
    updatedAt: new Date("2023-08-09T10:15:00"),
    authorId: "2",
    author: sampleUsers[1],
    likes: ["1"],
    comments: [],
    tags: ["#StudyTips", "#CourseSelection"],
  },
];

interface ProfilePageProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const ProfilePage = ({ toggleDarkMode, isDarkMode }: ProfilePageProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [profileUser, setProfileUser] = useState<User | undefined>(undefined);
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  
  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Convert string dates back to Date objects
      parsedUser.createdAt = new Date(parsedUser.createdAt);
      setCurrentUser(parsedUser);
      
      // If no ID provided, show current user's profile
      if (!id) {
        setProfileUser(parsedUser);
        
        // Filter posts for current user
        setUserPosts(samplePosts.filter(post => post.authorId === parsedUser.id));
      }
    } else if (!id) {
      // Not logged in and no ID provided, redirect to login
      navigate("/auth?mode=login");
    }
  }, [id, navigate]);
  
  // If ID provided, fetch that user
  useEffect(() => {
    if (id) {
      // In a real app, you'd fetch the user from your API
      // For now, we'll use the sample data
      const user = sampleUsers.find(user => user.id === id);
      if (user) {
        setProfileUser(user);
        
        // Filter posts for this user
        setUserPosts(samplePosts.filter(post => post.authorId === id));
      } else {
        // User not found
        navigate("/not-found");
      }
    }
  }, [id, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      
      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          {profileUser ? (
            <Profile 
              currentUser={currentUser} 
              userPosts={userPosts}
            />
          ) : (
            <div className="text-center py-12">
              <p>Loading profile...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
