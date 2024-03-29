import { Button, Typography } from "@mui/material";
import { Icon } from "@iconify/react";

interface Props {
    replyCount: number,
    onClick: () => void,
}

function ButtonComment(props: Props) {

    return (
        <Button sx={{ fontSize: '0.7rem', textTransform: 'none' }} size='small' color='primary' startIcon={<Icon icon='solar:chat-line-line-duotone' fontSize={10} />} onClick={props.onClick}>
            {props.replyCount > 0 && (
                <Typography ml={-1.4} mr={1.4} fontSize={10}>{props.replyCount}</Typography>
            )}
            Comment
        </Button>
    )
}

export default ButtonComment