import styled from 'styled-components'

export const AuthContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background: linear-gradient(
        90deg,
        rgba(2, 0, 36, 1) 0%,
        rgba(121, 71, 9, 1) 36%,
        rgba(89, 21, 74, 1) 75%,
        rgba(5, 7, 70, 1) 100%
    );

    option {
        background: black;
        color: wheat;
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        margin: 0 auto;
        img {
            height: 5rem;

            svg {
                path {
                    fill: #d7be0f;
                }
            }
        }
        h1 {
            text-transform: uppercase;
            color: #d7be0f;
        }
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #2a194c;
        border-radius: 2rem;
        padding: 5rem 10rem;
    }

    input {
        padding: 0.5rem;
        border: 0.1rem solid #4e0eff;
        border-radius: 0.4rem;
        color: black;
        font-size: 1rem;
        width: 100%;

        &:focus {
            border: 0.1rem solid #997af0;
            outline: none;
        }
    }

    button {
        color: white;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;

        &:hover {
            color: white;
            background-color: #ffbb0e;
        }
    }

    span {
        a {
            text-decoration: none;
            font-weight: bold;
        }
    }
    .selectWrapper {
        display: flex;
        align-items: center;
    }
    .room-title {
        font-size: 24px;
        padding: 0;
        margin-bottom: 10px;
        color: lavender;
    }
    .room-selector {
        width: 100%;
        background-color: black;
    }
    .collapse-btn {
        background: lavender;
        outline: 5px;
        border-radius: 5px;
    }
`
