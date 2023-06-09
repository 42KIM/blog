import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { APIService } from '@/apis';
import { useUser } from '@/lib/auth.service';
import { useDialog } from '@/lib/use-dialog';
import type { Post } from '@/models/Posts';
import PostContent from './Content';

type PostPageProps = {
  post: Post,
};

const PostPage = ({ post }: PostPageProps) => {
  const router = useRouter();
  const user = useUser();
  const { showDialog, showErrorDialog } = useDialog();

  const handleDelete = async () => {
    try {
      await APIService.deletePosts({ _id: post._id });
      await APIService.revalidatePosts();
      showDialog({
        title: '완료',
        content: '게시물이 삭제되었습니다.',
        onConfirm: () => router.push('/posts'),
      });
    } catch (error) {
      showErrorDialog(error);
    }
  };

  // TODO - loading spinner 추가
  if (router.isFallback) return <div>Loading Page...</div>;

  if (!post) return null;

  return (
    <>
      <Head>
        <title>{`${post.title} - 42's blog`}</title>
        <meta name="description" content={post.description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
      </Head>
      <div className="flex justify-between text-sm text-blue-300">
        <Link href="/posts">
          <button>◀️ 목록</button>
        </Link>
        {user?.isAdmin && (
          <div className="flex gap-4">
            <button
              onClick={() => {
                router.push(`/posts/${post._id}/edit`);
              }}
            >수정하기
            </button>
            <button onClick={handleDelete}>삭제하기</button>
          </div>
        )}
      </div>
      <PostContent post={post} />
    </>
  );
};

PostPage.getPageProps = () => {
  return {
    hasOgTag: true,
  };
};

export default PostPage;
