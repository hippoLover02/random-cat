import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import styles from './index.module.css';

// getServerSidePropsから渡されるpropsの型
type Props = {
    initialImageUrl: string;
};

const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
    const [imageUrl, setImageUrl] = useState(initialImageUrl);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     fetchImage().then((newImage) => {
    //         setImageUrl(newImage.url);
    //         setLoading(false);
    //     });
    // }, []);

    const handleClick = async () => {
        setLoading(true);
        const newImage = await fetchImage();
        setImageUrl(newImage.url);
        setLoading(false);
    };

    return (
        <div className={styles.page}>
            <button onClick={handleClick} className={styles.button}>
                ほかのにゃんこも見るにゃん？
            </button>
            <div className={styles.frame}>
                {loading || <img src={imageUrl} className={styles.img} />}
            </div>
        </div>
    );
};
export default IndexPage;

// exe on serverside
// IndexPageコンポーネントが引数で受け取るpropsを戻り値に含める。
// Next.jsに認識させるために、exportしておく。
export const getServerSideProps: GetServerSideProps<Props> = async () => {
    const image = await fetchImage();
    return {
        props: {
            initialImageUrl: image.url,
        },
    };
};

type Image = {
    id: string;
    url: string;
};
const fetchImage = async (): Promise<Image> => {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const images: unknown = await res.json();
    if(!Array.isArray(images)) throw new Error("画像取得失敗");
    const image: unknown = images[0];
    if (!isImage(image)) throw new Error("画像取得失敗");
    return image;
};

// 型ガード関数
const isImage = (value: unknown): value is Image => {
    // 値がオブジェクト
    if (!value || typeof value !== "object") {
        return false;
    }
    // urlプロパティが存在し、それが文字列
    return "url" in value && typeof value.url === "string";
}

fetchImage().then((image) => {
    console.log(image.id);
});