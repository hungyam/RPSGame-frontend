import * as C from "@chakra-ui/react"
import React from "react";

const Button: React.FC<C.BoxProps & {isActive?: boolean}> = (props) => {
    return <C.Box display='inline-block'
                  role='group'
                  alignSelf={props.alignSelf}
                  onClick={props.onClick}
                  pos={props.pos ?? 'relative'}
    >
        <C.Box bgColor={props.isActive? 'pink.300': 'btn'}
               borderRadius='full'
               pos='relative'
               top='0'
               px={props.px}
               py={props.py}
               whiteSpace='nowrap'
               fontWeight='bold'
               border='2px solid black'
               zIndex='3'
               transition='300ms all'
               _groupHover={{
                   top: '1'
               }}
               _groupActive={{
                   bgColor: 'pink.300'
               }}
        >
            {props.children}
        </C.Box>
        <C.Box bgColor='btnShadow'
               borderRadius='full'
               pos='absolute'
               top='2'
               px={props.px}
               py={props.py}
               whiteSpace='nowrap'
               color='transparent'
               fontWeight='bold'
               border='2px solid black'
               zIndex='2'
        >
            {props.children}
        </C.Box>
        <C.Box bgColor='bgShadow'
               borderRadius='full'
               pos='absolute'
               top='5'
               left='1.5'
               px={props.px}
               py={props.py}
               whiteSpace='nowrap'
               color='transparent'
               fontWeight='bold'
               zIndex='1'
               transition='300ms all'
               _groupHover={{
                   top: '4',
                   left: '1'
               }}
        >
            {props.children}
        </C.Box>
    </C.Box>

}

export default Button
