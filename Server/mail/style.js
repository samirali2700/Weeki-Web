export const style = `
    <style>

        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }
        .hero {
            width: 450px;
            height: auto;
            margin:15px auto;             
        }

        .intro {
            display: flex;
            align-items: center;
            column-gap: 15px;
        }

        .content {
            min-height:250px;
            padding:45px 35px;
            box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
            border:1px solid #0088ff;
            border-radius: 5px;
        }

        .button a {
            margin: 25px 0;
            text-align: center; 
            color: #fff;
            background-color: #0088ff; 
            border: 1px solid #fff; 
            display: block; 
            padding: 14px 20px; 
            border-radius: 5px;
        }
        .text {
            font-family: Arial, serif, EmojiFont;
            font-size: 16px;
            line-height: 24px; 
            text-align: left;
            color: rgb(106, 111, 130);
            margin-top: 25px;
        }
        a {
            text-decoration: none;
            color: #0088ff;
        }
        #logo{
            width:10em;
        }
        #mail {
            width: 26px;
        }
        .footer {
            margin: 35px 0;
            text-align: center;
        }
    </style>
`;
