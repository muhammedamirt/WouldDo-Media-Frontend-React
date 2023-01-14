import { useState } from "react";
import { Card } from "../Card/Card"
import { Link } from 'react-router-dom'
import OutsideClickHandler from 'react-outside-click-handler';
import { commentPost, fetchPostComments, handleLikePost } from "../../../api/user";
import Moment from 'react-moment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Comments from "./Comments";
import { useLongPress } from 'use-long-press';


const PostForm = ({ post }) => {
  const userId = localStorage.getItem('id')
  const [dropdown, setDropDown] = useState(false)
  const [likeStatus, setLikeStatus] = useState(post?.likes?.includes(userId))
  const [likeCount, setLikeCount] = useState(post?.likes.length)
  const [commentIsOpen, setCommentIsOpen] = useState(false)
  const [comment, setComment] = useState(null)
  const [commentFormVal, setCommentFormVal] = useState(false)
  const [fetchedComments, setFetchedComments] = useState(null)
  const [longPressed, setLongPressed] = useState(false)

  const handleLongPress = () => {
    if (longPressed) {
      setLongPressed(false)
    }
  }
  const bind = useLongPress(() => {
    setLongPressed(true)
  });
 

  const handleLike = async (postId) => {
    setLikeStatus(!likeStatus)
    await handleLikePost(postId, userId)
    if (!likeStatus) {
      setLikeCount(likeCount + 1)
    } else {
      setLikeCount(likeCount - 1)
    }
  }

  const handleCommentClick = async (postId) => {
    setCommentIsOpen(true)
    if (!commentIsOpen) {
      const commentsData = await fetchPostComments(postId)
      setFetchedComments(commentsData)
    } else {
      setCommentIsOpen(!commentIsOpen)
    } 
  }
  const handleSendComment = async (postId) => {
    const commentData = {
      userId,
      postId,
      comment
    }
    if (comment) {
      if (comment !== "") {
         await commentPost(commentData)
        handleCommentClick(postId)
        setComment('')
      } else {
        setCommentFormVal(true)
      }
    } else {
      setCommentFormVal(true)
    }
  }

  const commentTexting = (e) => {
    setCommentFormVal(false)
    setComment(e.target.value)
  }

  return (
    <div>
      <Card>
        <div className="flex gap-3" key={post?._id}>
          <div>
            <div className='w-12 h-12 rounded-full overflow-hidden shadow-sm shadow-gray-500'>
              <img src={post?.userId?.picture} alt="avatars" />
            </div>
          </div>
          <div className="grow">
            <Link to={userId !== post?.userId?._id ? `/profile/${post?.userId?._id}` : '/myprofile'} className="font-semibold hover:underline cursor-pointer">{post?.userId?.username}</Link>
            <p className="text-blue-600 text-sm">Location</p>
          </div>
          <div>
            <button onClick={() => setDropDown(!dropdown)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
              </svg>
            </button>

            <OutsideClickHandler onOutsideClick={() => {
              setDropDown(false)
            }}>
              <div className="relative">
                {dropdown && (
                  <div className="absolute right-6 w-52 bg-white shadow-md shadow-gray-500 p-3 rounded-md">
                    <p className="flex py-2 gap-2  hover:bg-heavy-metal-100 -mx-3 px-10 rounded-md transition-all hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                      </svg>
                      Save
                    </p>
                    <p className="flex py-2 gap-2  hover:bg-heavy-metal-100 -mx-3 px-10 rounded-md transition-all hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                      Report</p>
                    <p className="flex py-2 gap-2 hover:bg-heavy-metal-100 -mx-3 px-10 rounded-md transition-all hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                      Hide</p>
                    <p className="flex py-2 gap-2 hover:bg-heavy-metal-100 -mx-3 px-10 rounded-md transition-all hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                      </svg>
                      Copy link</p>
                  </div>
                )}
              </div>
            </OutsideClickHandler>
          </div>
        </div>
        <div className="mt-2">
          <div className=" rounded-md overflow-hidden">
            <img onDoubleClick={() => handleLike(post._id)} src='https://cdn.kimkim.com/files/a/images/ef80bf6d27c3b6eb60a534712d60d3604a757b2d/big-e6f8c61e72a89be6dfc9ed5c7c65a562.jpg' alt="post" />
            {/* <span className="fixed text-red-600">
                  <FavoriteIcon />
            </span> */}
          </div>
          <div className="mt-4 flex gap-3">
            <button className="flex gap-2 items-center" onClick={() => handleLike(post._id)}>
              {likeStatus ?
                <span className="text-red-600">
                  <FavoriteIcon />
                </span>
                : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>}
              {likeCount}
            </button>
            <button onClick={() => handleCommentClick(post?._id)} className="flex gap-2 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              {/* {fetchedComments.length} */}
            </button>
            <button className="flex gap-2 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
              </svg>
            </button>
          </div>
          <div>
            {/* //moment */}
            <Moment className="text-sm text-snow-drift-400" fromNow>{post?.date}</Moment>
          </div>
          <p className="my-1 text-sm">{post?.text}</p>
          <div className="flex gap-2">
            <div className="flex gap-3">
              <div className='w-12 rounded-full overflow-hidden shadow-sm shadow-gray-500 mt-4'>
                <img src="https://i.pinimg.com/originals/31/44/7e/31447e25b7bc3429f83520350ed13c15.jpg" alt="avatars" />
              </div>
            </div>
            <div className=" grow mt-4 relative">
              <textarea value={comment} onChange={commentTexting} className="block rounded-full w-full p-2 h-10 px-4 overflow-hidden" placeholder="Write a comment..."></textarea>
              <button onClick={() => handleSendComment(post?._id)} className="absolute top-2 right-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
          {commentFormVal &&
            <div className="flex w-full justify-center">
              <p className="font-semibold text-red-600 text-sm">Fill the field</p>
            </div>}
          {commentIsOpen &&
            <div {...bind()} onClick={handleLongPress}>
              <Comments data={fetchedComments} longPressed={longPressed} />
            </div>
          }
        </div>
      </Card>

    </div>
  )
}

export default PostForm