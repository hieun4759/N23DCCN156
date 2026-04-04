from django.shortcuts import render, redirect
from .models import Comment

def home(request):
    # Nếu người dùng bấm "Gửi bình luận"
    if request.method == 'POST':
        if request.user.is_authenticated:
            noidung = request.POST.get('text')
            Comment.objects.create(user=request.user, text=noidung)
            return redirect('home')
        else:
            return redirect('login')

    # Lấy tất cả bình luận để hiển thị
    comments = Comment.objects.all().order_by('-created_at')
    return render(request, 'home.html', {'comments': comments})