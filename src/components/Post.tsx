
import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Post as PostType, Comment as CommentType } from "@/utils/types";
import { 
  Heart, 
  MessageCircle, 
  MoreHorizontal, 
  Share, 
  Trash,
  Edit,
  Send
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface PostProps {
  post: PostType;
  currentUser?: User;
}

const Post = ({ post, currentUser }: PostProps) => {
  const [liked, setLiked] = useState(post.likes.includes(currentUser?.id || ""));
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>(post.comments || []);
  
  const handleLike = () => {
    setLiked(!liked);
    // In a real app, you'd send this to your API
  };
  
  const handleComment = () => {
    if (!newComment.trim()) return;
    
    const comment: CommentType = {
      id: Date.now().toString(),
      content: newComment,
      createdAt: new Date(),
      authorId: currentUser?.id || "",
      author: currentUser,
      postId: post.id,
      likes: [],
    };
    
    setComments([...comments, comment]);
    setNewComment("");
    // In a real app, you'd send this to your API
  };
  
  const handleDelete = () => {
    // In a real app, you'd send this to your API
    console.log("Deleting post:", post.id);
  };

  const isAuthor = currentUser?.id === post.author?.id;
  
  return (
    <Card className="mb-6 overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author?.avatar} />
              <AvatarFallback className="bg-purple-100 text-purple-800">
                {post.author?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Link to={`/profile/${post.author?.id}`} className="font-medium hover:underline">
                  {post.author?.name}
                </Link>
                <Badge variant="outline" className="text-xs px-2 py-0">
                  {post.author?.role}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground flex gap-2">
                <span>{post.author?.department}</span>
                <span>•</span>
                <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit Post</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete} 
                  className="flex items-center gap-2 text-red-500 focus:text-red-500"
                >
                  <Trash className="h-4 w-4" />
                  <span>Delete Post</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <div className="whitespace-pre-wrap mb-3">{post.content}</div>
        
        {/* Hashtags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.map((tag) => (
              <Link 
                key={tag} 
                to={`/tag/${tag.replace("#", "")}`}
                className="text-purple-500 hover:text-purple-700 text-sm"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
        
        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 mb-3 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {post.images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`Post image ${index + 1}`} 
                className="rounded-md w-full object-cover max-h-96"
              />
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-0 border-t">
        <div className="w-full">
          {/* Post actions */}
          <div className="flex border-b">
            <Button 
              variant="ghost" 
              className={`flex-1 gap-2 rounded-none py-5 ${liked ? 'text-red-500' : ''}`} 
              onClick={handleLike}
            >
              <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
              <span>{post.likes.length + (liked && !post.likes.includes(currentUser?.id || "") ? 1 : 0)}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="flex-1 gap-2 rounded-none py-5" 
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-5 w-5" />
              <span>{comments.length}</span>
            </Button>
            
            <Button variant="ghost" className="flex-1 gap-2 rounded-none py-5">
              <Share className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Comments section */}
          {showComments && (
            <div className="p-4">
              {/* Comment list */}
              <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author?.avatar} />
                        <AvatarFallback className="bg-purple-100 text-purple-800 text-xs">
                          {comment.author?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="bg-secondary p-3 rounded-lg">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <Link to={`/profile/${comment.author?.id}`} className="font-medium text-sm hover:underline">
                                {comment.author?.name}
                              </Link>
                              <Badge variant="outline" className="text-xs px-1.5 py-0">
                                {comment.author?.role}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="mt-1 text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Add comment */}
              <div className="flex gap-3 items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback className="bg-purple-100 text-purple-800">
                    {currentUser?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 flex gap-2">
                  <Input 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleComment();
                      }
                    }}
                  />
                  <Button size="icon" onClick={handleComment} disabled={!newComment.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default Post;
