import { ImageList, ImageListItem } from "@mui/material"; 

const ImageListPreview = (props: { urls: string[] }) => {
    const { urls } = props;     
    const onError = (e:any) => {
        e.target.onerror = null; // Prevent infinite loop
        e.target.src = `/images/no-image.jpg`; // Set fallback image
    };

    let cols = 1,
        itemRows = 1,
        itemCols = 1,
        defaultRows = 1,
        defaultCols = 1;

    if (urls?.length == 1) {
        cols = 4;
        itemRows = 3;
        itemCols = 4;
    }

    if (urls?.length == 2) {
        cols = 4;
        itemRows = 3;
        itemCols = 2;
        defaultRows = 3;
        defaultCols = 2;
    }

    if (urls?.length == 3) {
        cols = 2;
        itemRows = 2;
        itemCols = 2;
    }

    if (urls?.length == 4) {
        cols = 4;
        itemRows = 3;
        itemCols = 3;
    } 

    return urls?.length > 0 ? (
        <ImageList
            sx={{ width: '100%', height: 580, objectFit: 'contain', overflow: 'hidden', my: 2, borderRadius: '8px', boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)', }}
            variant="quilted"
            cols={cols}
            rowHeight={580 / 3}
        >
            {urls.map((item, i) => (
                <ImageListItem

                    key={item}
                    rows={i == 0 ? itemRows : defaultRows}
                    cols={i == 0 ? itemCols : defaultCols}
                >
                    <img onError={onError} src={item}   alt={item} loading="lazy" style={{ objectFit: 'contain', width: '100%', height: '100%' }}/>
                </ImageListItem>
            ))}
        </ImageList>
    ) : <></>;
}


export default ImageListPreview;