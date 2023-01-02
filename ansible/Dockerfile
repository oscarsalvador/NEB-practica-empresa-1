FROM manjarolinux/base:latest

RUN pacman -Syu --noconfirm ansible python-pip
# RUN echo "alias ll=\"ls -lah\"" >> /etc/profile # me quedo sin ll, que no funciona
RUN curl -L https://aka.ms/InstallAzureCli -o InstallAzureCli
RUN chmod +x InstallAzureCli
# RUN echo -e "\n\n\n\n"  > respuestas
# RUN cat respuestas
# RUN ./InstallAzureCli < respuestas
# gracias microsoft, por no usar estandares unix y dejarme automatizar el tui alimentando
# enters, hay que hacer un commit de la imagen despues de cambiarla a mano
# docker commit ansiblewip ansible:1.0.0