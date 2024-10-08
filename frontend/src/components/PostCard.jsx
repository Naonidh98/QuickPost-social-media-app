import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NoProfile } from "../assets/index";
import { BiLike, BiSolidLike, BiComment } from "react-icons/bi";
import { MdOutlineDeleteOutline } from "react-icons/md";
import moment from "moment";
import { useForm } from "react-hook-form";
import { TextInput, Loading, CustomButton } from "../components/index";
import { postComments } from "../../data/dummyData";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePost,
  likePostHandler,
  commentPostHandler,
} from "../services/operations/postAPI";



/// comment form

const CommentForm = ({ user, id, replyAt, getComments, postId, setData }) => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("comment", data.comment);

    dispatch(
      commentPostHandler(
        token,
        { comment: data?.comment, postId: postId },
        setData
      )
    );
  };

  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full flex items-center gap-2 py-4">
        <img
          src={user?.profileUrl ?? NoProfile}
          alt="userImg"
          className="w-10 h-10 rounded-full object-cover"
        />

        <TextInput
          name="comment"
          styles={"w-full rounded-full py-3 bg-richblack-900"}
          placeholder={replyAt ? `Reply @${replyAt}` : `Comment this post`}
          register={register("comment", {
            required: "Comment can not be empty",
          })}
          error={errors.comment ? errors.comment.message : ""}
        />

        {errMsg?.message && (
          <span
            className={`text-sm ${
              errMsg?.status === "failed"
                ? "text-[#f64949f8]"
                : "text-[#2ba150fe]"
            } mt-0.5`}
          >
            {errMsg?.message}
          </span>
        )}
      </div>
      <div className="flex flex-end justify-end pb-2">
        {loading ? (
          <Loading />
        ) : (
          <CustomButton
            title={"Submit"}
            type={"submit"}
            containerStyles={
              "bg-[#4444a4] text-white py-1 px-3 rounded-full font-semibold text-sm right-0"
            }
          />
        )}
      </div>
    </form>
  );
};

//reply card

const ReplyCard = ({ reply, user, handleLike }) => {
  return (
    <div className="w-full py-3">
      <div className="flex gap-3 items-center mb-1">
        <Link to={"/profile/" + reply?.userId?._id}>
          <img
            src={reply?.userId?.profileUrl ?? NoProfile}
            alt={reply?.userId?.firstName}
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>

        <div className="">
          <Link to={"/profile/" + reply?.userId?._id}>
            <p className="font-medium text-base ">
              {`${reply?.userId?.firstName} ${reply?.userId?.lastName}`}
            </p>
          </Link>
          <span className="text-sm">
            {moment(reply?.createdAt ?? "2024-08-04").fromNow()}
          </span>
        </div>
      </div>
      <div className="ml-12 text-white/80">
        <p className="">{reply?.comment}</p>
        <div className="mt-2 flex gap-6">
          <p
            className="flex gap-2 items-center text-base cursor-pointer"
            onClick={() => {}}
          >
            {reply?.likes?.includes(user?._id) ? (
              <BiSolidLike size={20} />
            ) : (
              <BiLike size={20} />
            )}
            <span>{`${reply?.likes.length} Likes`}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const PostCard = ({ post, user, delete_Post, likePost }) => {
  const [showAll, setShowAll] = useState(0);
  const [showReply, setShowReply] = useState(0);
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyComments, setReplyComments] = useState(0);
  const [showComments, setShowComments] = useState(0);

  const [data, setData] = useState(post);
  console.log("data", data);

  const getComments = async () => {
    setReplyComments(0);
    setComments(postComments);
    setLoading(false);
  };

  useEffect(() => {
    getComments();
  }, []);

  const { token } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  return (
    <div className="text-white mb-2 bg-richblack-700 p-4 rounded-xl">
      {/* avatar */}
      <div className="flex gap-4 items-center mb-2">
        {/* Profile img */}
        <Link>
          <img
            src={post?.userId?.profileUrl ?? NoProfile}
            alt={post?.userId?.firstName}
            className="w-14 h-14 object-cover rounded-full"
          />
        </Link>

        {/* user name*/}
        <div className="w-full flex justify-between">
          <div>
            <Link className="">
              <p className="font-medium text-lg ">
                {`${post?.userId?.firstName} ${post?.userId?.lastName}`}
              </p>
            </Link>
            <span className="text-white/70">{post?.userId?.location}</span>
          </div>

          <div className="text-white/70">
            {moment(post?.createdAt ?? "2024-08-03").fromNow()}
          </div>
        </div>
      </div>

      {/* desc */}
      <div className="text-white/80 mt-4">
        <p>
          {showAll === post?._id
            ? post?.description
            : `${post?.description.slice(0, 300)}`}
          {post?.description.length > 301 &&
            (showAll === post?._id ? (
              <span
                className="text-blue-100 font-medium cursor-pointer ml-2"
                onClick={() => {
                  setShowAll(0);
                }}
              >
                Show Less
              </span>
            ) : (
              <span
                className="text-blue-100 font-medium cursor-pointer ml-2"
                onClick={() => {
                  setShowAll(post?._id);
                }}
              >
                Show More
              </span>
            ))}
        </p>

        {/* media  */}
        
        <img src={post?.image} alt="" className="w-full mt-2 rounded-lg" loading="lazy"/>
      </div>

      {/* likes  + comment*/}
      <div className="mt-4 flex justify-between items-center px-3 py-2 text-base border-t border-[#66666645]">
        <div
          className="flex gap-2 items-center text-base cursor-pointer"
          onClick={() => {
            dispatch(likePostHandler(token, { postId: data?._id }, setData));
          }}
        >
          <BiLike size={20} />
          {data?.likes.length} Likes
        </div>

        <p
          className="flex gap-2 items-center text-base cursor-pointer"
          onClick={() => {
            if (showComments === null) {
              setShowComments(post?._id);
            } else {
              setShowComments(null);
            }
          }}
        >
          <BiComment size={20} />
          {data?.comments?.length} Comments
        </p>

        {/* delete */}
        {user?._id === post?.userId?._id && (
          <div
            className="flex gap-1 items-center text-base cursor-pointer"
            onClick={() => {
              dispatch(deletePost(token, { postId: post?._id }));
            }}
          >
            <MdOutlineDeleteOutline size={20} />
            <span>Delete</span>
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="bg-richblack-900 px rounded-lg px-2">
        {showComments === post?._id && (
          <div className="w-full overflow-auto h-96  flex flex-col-reverse mt-4 border-t border-[#66666645] pt-4">
            <CommentForm
              user={user}
              id={post?._id}
              getComments={() => {
                getcomments(post?._id);
              }}
              postId={data?._id}
              setData={setData}
            />

            {/* all comment of this post */}
            {loading ? (
              <Loading />
            ) : data?.comments?.length > 0 ? (
              <div>
                {data?.comments.map((comment) => (
                  <div key={comment?._id} className="w-full p-2 my-4">
                    <div className="flex gap-3 items-center">
                      {/*image  + bio */}

                      <Link to={"/profile/" + comment?.userId?._id}>
                        <img
                          src={comment?.userId?.profileUrl ?? NoProfile}
                          alt={comment?.userId?.firstName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </Link>
                      <Link to={"/profile/" + comment?.userId?._id}>
                        <p className="font-medium text-base text-white/80">
                          {`${comment?.userId?.firstName} ${comment?.userId?.lastName}`}
                        </p>
                      </Link>
                      <span className="text-sm text-white-90 ">
                        {moment(comment?.createdAt ?? "2023-05-2023").fromNow()}
                      </span>
                    </div>

                    {/* desc */}
                    <div className="ml-12">
                      <p className="pl-1">{comment?.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full text-sm py-4 text-center">
                No Comments, be first to comment
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
