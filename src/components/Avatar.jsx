const Avatar = ({ avatar }) => {

    return (
        <section className="flex flex-col">
            <div>
                <img src={avatar} alt="avatar" width={64} height={64} />
            </div>
        </section>
    )
};

export default Avatar;
